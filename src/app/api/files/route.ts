import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth";
import { ALLOWED_TYPES, ensureUploadDir, UPLOAD_DIR } from "@/lib/upload";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await prisma.file.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true } },
    },
  });

  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File and title are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not supported" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const record = await prisma.file.create({
      data: {
        title,
        description,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedById: admin.id,
      },
      include: {
        uploadedBy: { select: { name: true } },
      },
    });

    return NextResponse.json({ file: record }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

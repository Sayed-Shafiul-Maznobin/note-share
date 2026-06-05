import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/upload";
import path from "path";
import fs from "fs/promises";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, file.filename);
    try {
      await fs.unlink(filePath);
    } catch {
      // File may already be deleted from disk
    }

    await prisma.file.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

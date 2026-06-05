import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { FileGrid } from "@/components/FileGrid";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const files = await prisma.file.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true } },
    },
  });

  const serialized = files.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shared Notes</h2>
            <p className="text-gray-500 mt-1">
              {files.length} file{files.length !== 1 ? "s" : ""} available
            </p>
          </div>
          {session.role === "ADMIN" && (
            <Link href="/upload">
              <Button>
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </Link>
          )}
        </div>

        <FileGrid
          initialFiles={serialized}
          isAdmin={session.role === "ADMIN"}
        />
      </main>
    </div>
  );
}

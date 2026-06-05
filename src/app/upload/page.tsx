import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { UploadForm } from "@/components/UploadForm";

export default async function UploadPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upload a Note</h2>
          <p className="text-gray-500 mt-1">
            Share images, PDFs, and documents with your clients
          </p>
        </div>

        <div className="glass-card p-8">
          <UploadForm />
        </div>
      </main>
    </div>
  );
}

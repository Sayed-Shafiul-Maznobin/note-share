"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileUp } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function UploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function handleFileSelect(selected: File | null) {
    if (!selected) return;
    setFile(selected);
    if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) {
      setError("Please provide a title and select a file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (description) formData.append("description", description);

    try {
      const res = await fetch("/api/files", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileUp className="w-10 h-10 text-brand-600" />
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(1)} KB — click to change
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="font-medium text-gray-700">Drop a file here or click to browse</p>
            <p className="text-sm text-gray-400">Images, PDFs, documents, and more</p>
          </div>
        )}
      </div>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give your note a title"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a short description..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-gray-400 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={loading} className="flex-1">
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

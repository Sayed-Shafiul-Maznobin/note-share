"use client";

import { useState } from "react";
import { FileCard } from "./FileCard";
import { FolderOpen } from "lucide-react";

interface FileRecord {
  id: string;
  title: string;
  description: string | null;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  uploadedBy: { name: string };
}

interface FileGridProps {
  initialFiles: FileRecord[];
  isAdmin?: boolean;
}

export function FileGrid({ initialFiles, isAdmin }: FileGridProps) {
  const [files, setFiles] = useState(initialFiles);

  function handleDelete(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No files yet</h3>
        <p className="text-gray-500 mt-1">
          {isAdmin
            ? "Upload your first note to get started"
            : "Check back later for shared notes"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

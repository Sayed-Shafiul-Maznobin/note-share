"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "./ui/Button";
import { formatFileSize, getFileIcon } from "@/lib/files";

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

interface FileCardProps {
  file: FileRecord;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const iconMap = {
  image: ImageIcon,
  pdf: FileText,
  file: FileText,
};

export function FileCard({ file, isAdmin, onDelete }: FileCardProps) {
  const [preview, setPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const iconType = getFileIcon(file.mimeType);
  const Icon = iconMap[iconType];
  const canPreview = file.mimeType.startsWith("image/") || file.mimeType === "application/pdf";

  async function handleDelete() {
    if (!confirm("Delete this file permanently?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/files/${file.id}`, { method: "DELETE" });
      if (res.ok) onDelete?.(file.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <article className="glass-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-brand-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{file.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{file.originalName}</p>
          </div>
        </div>

        {file.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{file.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatFileSize(file.size)}</span>
          <span>·</span>
          <span>{file.uploadedBy.name}</span>
          <span>·</span>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          {canPreview && (
            <Button variant="secondary" className="flex-1" onClick={() => setPreview(true)}>
              <Eye className="w-4 h-4" />
              View
            </Button>
          )}
          <a href={`/api/files/${file.id}/download`} className="flex-1">
            <Button variant="primary" className="w-full">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </a>
          {isAdmin && (
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </article>

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreview(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold truncate">{file.title}</h3>
              <button
                onClick={() => setPreview(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-64px)] flex items-center justify-center bg-gray-50">
              {file.mimeType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/files/${file.id}/view`}
                  alt={file.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <iframe
                  src={`/api/files/${file.id}/view`}
                  className="w-full h-[70vh] rounded-lg border"
                  title={file.title}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

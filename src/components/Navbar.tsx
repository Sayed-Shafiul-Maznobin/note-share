"use client";

import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Upload } from "lucide-react";
import { Button } from "./ui/Button";
import type { SessionUser } from "@/lib/auth";

interface NavbarProps {
  user: SessionUser;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">NoteShare</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Shared notes & files</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Button
              variant="secondary"
              onClick={() => router.push("/upload")}
              className="hidden sm:inline-flex"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} title="Sign out">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

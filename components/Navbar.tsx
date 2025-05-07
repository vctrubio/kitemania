"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";

function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  return (
    <button
      aria-label="Toggle theme"
      className={`relative w-14 h-8 bg-transparent border-2 border-slate-400 dark:border-slate-600 rounded-full flex items-center transition-colors duration-300 px-1`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <span
        className={`absolute top-1 w-6 h-6 rounded-full shadow transition-transform duration-300 ${theme === "dark" ? "translate-x-6 bg-slate-800" : "translate-x-0 bg-slate-100"}`}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
      />
      <span className={`absolute left-1.5 w-4 h-4 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-yellow-300"} transition-colors duration-300`} />
      <span className={`absolute right-1.5 w-4 h-4 rounded-full ${theme === "dark" ? "bg-yellow-300" : "bg-slate-700"} transition-colors duration-300`} />
    </button>
  );
}

function LocksmithIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline align-middle mr-2"><circle cx="12" cy="12" r="10"/><rect x="9" y="11" width="6" height="4" rx="1"/><path d="M12 7v4"/></svg>
  );
}

export function Navbar() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <nav className="flex gap-6">
        <Link href="/" className="font-semibold hover:underline">Home</Link>
        <Link href="/balance" className="font-semibold hover:underline">Balance</Link>
        <Link href="/calendar" className="font-semibold hover:underline">Calendar</Link>
        <Link href="/users" className="font-semibold hover:underline">Users</Link>
      </nav>
      <div className="flex items-center gap-6">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        {isAuthenticated && (
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-base font-medium ml-2"
            onClick={() => void signOut().then(() => { router.push("/signin"); })}
          >
            <LocksmithIcon />Sign out
          </button>
        )}
      </div>
    </header>
  );
}
"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function Navbar() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <span>Convex + Next.js + Convex Auth</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-md px-2 py-1 border border-slate-300 dark:border-slate-700"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
        {isAuthenticated && (
          <button
            className="rounded-md px-2 py-1 border border-slate-300 dark:border-slate-700"
            onClick={() =>
              void signOut().then(() => {
                router.push("/signin");
              })
            }
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
} 
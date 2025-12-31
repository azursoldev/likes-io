import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import "./dashboard.css";

// Prevent the layout from running its own auth checks for the login page
// Since the login page is technically under /admin, this layout applies to it too
// unless we move the login page out or handle it here.
// However, the best practice is to move the login page to /login or /auth/login
// But since the structure is /admin/login, we must check if we are on the login page.
// BUT: We cannot check the pathname in a server component layout easily without headers.
// So the cleaner fix is to move auth check to page level or middleware, 
// OR simpler: don't apply this layout to the login page.
// Next.js nested layouts: /admin/layout.tsx applies to /admin/*
// /admin/login/layout.tsx applies to /admin/login/* (and inherits from /admin/layout.tsx)
// To avoid this, we should NOT have the auth check in /admin/layout.tsx if it wraps /admin/login.

// STRATEGY: We will keep the layout for styles but remove the server-side redirect 
// and rely on Middleware for protection. Middleware is already configured to protect /admin.
// If middleware fails, we can add a client-side check or a check in specific page components.
// For now, removing the redirect loop source is priority.

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll rely on Middleware (middleware.ts) for auth protection
  // This avoids the redirect loop where /admin/login (protected by this layout) 
  // redirects to /admin/login, ad infinitum.
  
  return <>{children}</>;
}

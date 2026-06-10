"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Haal token uit localStorage als fallback
      const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/auth/check", { headers });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      
      if (!data.authenticated) {
        // Verwijder token uit localStorage als authenticatie faalt
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-token");
        }
        router.push("/login");
      }
    } catch {
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
      }
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Verwijder ook uit localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
    }
    router.push("/login");
    router.refresh();
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/plants", label: "Planten", icon: "🌿" },
    { href: "/admin/walk", label: "Wandeling", icon: "🚶" },
    { href: "/admin/blog", label: "Blog", icon: "📝" },
    { href: "/admin/videos", label: "Video's", icon: "🎥" },
    { href: "/admin/settings", label: "Instellingen", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-accent">
                Admin Dashboard
              </Link>
              <nav className="hidden md:flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Bekijk Website
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}


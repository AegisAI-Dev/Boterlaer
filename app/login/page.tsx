"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check voor token in URL (van redirect - fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const success = urlParams.get("success");
      
      if (success === "true" && token) {
        localStorage.setItem("auth-token", token);
        router.push("/admin");
        router.refresh();
      }
    }
  }, [router]);

  const handleLogin = async (username: string, password: string) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies
      });

      // Probeer response als text eerst
      const responseText = await response.text();
      
      // Check of het SUCCESS:token format is
      if (responseText.startsWith('SUCCESS:')) {
        const token = responseText.substring(8);
        if (token) {
          localStorage.setItem("auth-token", token);
          router.push("/admin");
          router.refresh();
          return;
        }
      }
      
      // Fallback: probeer JSON parsing
      try {
        const data = JSON.parse(responseText);
        if (data.success) {
          // Als er een token in response zit, gebruik die
          const token = data.jwt || data.token || data.accessToken || data.data;
          if (token) {
            localStorage.setItem("auth-token", token);
            router.push("/admin");
            router.refresh();
            return;
          }
          
          // Als geen token in response, haal uit cookie (werkt over HTTPS later)
          // Voor nu: gebruik cookie als fallback
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(c => c.trim().startsWith('auth-token='));
          if (authCookie) {
            const token = authCookie.split('=')[1];
            localStorage.setItem("auth-token", token);
            router.push("/admin");
            router.refresh();
            return;
          }
        }
        setError(data.message || "Token niet ontvangen. Probeer het opnieuw.");
      } catch {
        setError("Ongeldige inloggegevens");
      }
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(username, password);
  };

  const handleQuickLogin = async () => {
    // Tijdelijke quick login voor development - VERWIJDEREN VOOR PRODUCTIE!
    await handleLogin("admin", "admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-botanical-sage/60 via-botanical-mint/80 to-primary-200/70 px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 bg-white shadow-xl">
          <div className="text-center mb-8">
            <h1 className="heading-2 text-accent mb-2">Admin Login</h1>
            <p className="text-gray-600">Beheer de website content</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* TIJDELIJKE QUICK LOGIN KNOP - VERWIJDEREN VOOR PRODUCTIE! */}
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? "Inloggen..." : "⚡ Direct Inloggen (Development)"}
            </button>
            <p className="mt-2 text-xs text-gray-600 text-center">
              Tijdelijke quick login voor development - verwijderen voor productie!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gebruikersnaam
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Inloggen..." : "Inloggen"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Terug naar website
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <p className="font-medium mb-1">Standaard inloggegevens:</p>
            <p>Gebruikersnaam: <strong>admin</strong></p>
            <p>Wachtwoord: <strong>admin123</strong></p>
            <p className="mt-2 text-xs italic">
              Wijzig deze na de eerste login!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@mentor-esgi/sdk";
import { connection } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const tokens = await api.functional.auth.login(connection, {
        email: form.get("email") as string,
        password: form.get("password") as string,
      });

      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      router.push("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 border border-gray-200 shadow-soft">
        <div className="flex items-center justify-center gap-2 mb-8 text-primary">
          <span className="material-symbols-outlined text-4xl">school</span>
          <span className="text-3xl font-bold tracking-tight">Mentor ESGI</span>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
          Connexion
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Consomme l&apos;API NestJS via le SDK Nestia
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link href="/register" className="font-semibold text-primary">
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

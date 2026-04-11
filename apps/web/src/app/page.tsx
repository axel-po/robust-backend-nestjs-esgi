import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <div className="w-full max-w-lg bg-card rounded-3xl p-8 border border-gray-200 shadow-soft">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
          Mentor ESGI
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Plateforme de mentorat — NestJS + tRPC + Convex
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Connexion (NestJS SDK)
            <span className="material-symbols-outlined">login</span>
          </Link>

          <Link
            href="/register"
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Inscription (NestJS SDK)
            <span className="material-symbols-outlined">person_add</span>
          </Link>

          <Link
            href="/mentors"
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            Liste des mentors (NestJS SDK)
            <span className="material-symbols-outlined">group</span>
          </Link>

          <Link
            href="/feedback"
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            Feedback mentors (tRPC)
            <span className="material-symbols-outlined">reviews</span>
          </Link>

          <Link
            href="/notifications"
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            Notifications (Convex)
            <span className="material-symbols-outlined">notifications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

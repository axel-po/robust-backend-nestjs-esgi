"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@mentor-esgi/sdk";
import { authConnection } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface MentorProfile {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  hourlyRate?: number;
  isAvailable: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const conn = authConnection(token);

    // Charger le profil utilisateur via le SDK Nestia
    api.functional.users.me
      .getMe(conn)
      .then((data) => setUser(data as User))
      .catch(() => {
        localStorage.removeItem("accessToken");
        router.push("/login");
      });

    // Charger les mentors
    api.functional.mentors
      .getAll(conn)
      .then((data) => setMentors(data))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 gradient-hero">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {user.name}
            </h1>
            <p className="text-sm text-gray-500">
              {user.role === "MENTOR" ? "Mentor" : "Mentee"} — {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Déconnexion
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          <Link
            href="/feedback"
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Feedback (tRPC)
          </Link>
          <Link
            href="/notifications"
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Notifications (Convex)
          </Link>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {user.role === "MENTOR"
            ? "Vos collègues mentors"
            : "Mentors disponibles"}
        </h2>

        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-card rounded-2xl p-6 border border-gray-200 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {mentor.hourlyRate && (
                  <span className="text-sm font-semibold text-accent-orange">
                    {mentor.hourlyRate}€/h
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

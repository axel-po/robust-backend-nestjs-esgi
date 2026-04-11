"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@mentor-esgi/sdk";
import { connection } from "@/lib/api";

interface MentorProfile {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  hourlyRate?: number;
  isAvailable: boolean;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.functional.mentors
      .getAll(connection)
      .then((data) => setMentors(data))
      .catch(() => setError("Impossible de charger les mentors"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-4 gradient-hero">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Mentors disponibles
          </h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            Retour
          </Link>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Données chargées via le SDK Nestia (cache Redis 30s)
        </p>

        {loading && <p className="text-center text-gray-500">Chargement...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

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

          {!loading && mentors.length === 0 && !error && (
            <p className="text-center text-gray-500 py-8">
              Aucun mentor disponible
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

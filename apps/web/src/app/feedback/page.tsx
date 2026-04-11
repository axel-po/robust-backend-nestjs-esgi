"use client";

import Link from "next/link";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface Feedback {
  id: string;
  mentorId: string;
  menteeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [mentorId] = useState("mentor-1");

  async function loadFeedbacks() {
    setLoading(true);
    try {
      const data = await trpc.getFeedbacks.query({ mentorId });
      setFeedbacks(data as Feedback[]);
    } catch {
      console.error("Erreur tRPC");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    await trpc.createFeedback.mutate({
      mentorId,
      menteeId: "mentee-1",
      rating: Number(form.get("rating")),
      comment: form.get("comment") as string,
    });

    formEl.reset();
    await loadFeedbacks();
  }

  return (
    <div className="min-h-screen p-4 gradient-hero">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Feedback Mentors
          </h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            Retour
          </Link>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Consomme le serveur tRPC — type-safety end-to-end sans SDK généré
        </p>

        <div className="bg-card rounded-2xl p-6 border border-gray-200 shadow-soft mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Laisser un avis</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Note
              </label>
              <select
                name="rating"
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Très bien</option>
                <option value="3">3 — Bien</option>
                <option value="2">2 — Moyen</option>
                <option value="1">1 — Mauvais</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Commentaire
              </label>
              <textarea
                name="comment"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 outline-none resize-none focus:ring-2 focus:ring-primary"
                placeholder="Votre avis sur le mentor..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Envoyer (tRPC mutation)
            </button>
          </form>
        </div>

        <button
          onClick={loadFeedbacks}
          disabled={loading}
          className="mb-4 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          {loading ? "Chargement..." : "Charger les avis (tRPC query)"}
        </button>

        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-card rounded-2xl p-4 border border-gray-200 shadow-soft"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-accent-orange font-semibold">
                  {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{f.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

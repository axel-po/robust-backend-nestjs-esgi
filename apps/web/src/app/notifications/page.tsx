"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://your-project.convex.cloud"
);

interface Notification {
  _id: string;
  userId: string;
  type: "NEW_REQUEST" | "REQUEST_ACCEPTED" | "NEW_MESSAGE";
  message: string;
  isRead: boolean;
  _creationTime: number;
}

const typeLabels = {
  NEW_REQUEST: "Nouvelle demande",
  REQUEST_ACCEPTED: "Demande acceptée",
  NEW_MESSAGE: "Nouveau message",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState("user-1");

  async function loadNotifications() {
    setLoading(true);
    try {
      const data = await convex.query("notifications:getByUser" as never, {
        userId,
      } as never);
      setNotifications(data as Notification[]);
    } catch {
      console.error("Convex non configuré — lancez: cd apps/convex-demo && npx convex dev");
    } finally {
      setLoading(false);
    }
  }

  async function createTestNotification() {
    try {
      await convex.mutation("notifications:create" as never, {
        userId,
        type: "NEW_REQUEST",
        message: "Un mentee veut rejoindre votre session",
      } as never);
      await loadNotifications();
    } catch {
      console.error("Convex non configuré");
    }
  }

  useEffect(() => {
    loadNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen p-4 gradient-hero">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            Retour
          </Link>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Consomme Convex — données réactives temps réel, zéro WebSocket à configurer
        </p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={loadNotifications}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            {loading ? "Chargement..." : "Rafraîchir (Convex query)"}
          </button>

          <button
            onClick={createTestNotification}
            className="px-4 py-2 rounded-xl bg-accent-orange text-white text-sm font-medium hover:bg-opacity-90 transition-all"
          >
            Créer une notification (Convex mutation)
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`bg-card rounded-2xl p-4 border shadow-soft ${
                n.isRead
                  ? "border-gray-200 opacity-60"
                  : "border-accent-orange/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-accent-orange">
                  {typeLabels[n.type]}
                </span>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-accent-orange" />
                )}
              </div>
              <p className="text-sm text-gray-700">{n.message}</p>
            </div>
          ))}

          {notifications.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8">
              Aucune notification — cliquez sur le bouton pour en créer une
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

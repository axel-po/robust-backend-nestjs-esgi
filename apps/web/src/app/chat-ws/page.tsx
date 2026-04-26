"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChatSocket } from "@/hooks/use-chat-socket";

export default function ChatWsPage() {
  const [token] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : localStorage.getItem("accessToken"),
  );
  const [sessionId, setSessionId] = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, connected, error } = useChatSocket(
    activeSessionId,
    token,
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-md max-w-sm w-full text-center">
          <h1 className="text-xl font-bold mb-2">Non connecté</h1>
          <p className="text-sm text-gray-500 mb-4">
            Connecte-toi pour utiliser le chat WebSocket.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold"
          >
            Aller au login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat WebSocket (NestJS)</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            connected
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {connected ? "🟢 Connecté" : "⚪ Déconnecté"}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          Erreur : {error}
        </div>
      )}

      {/* Session picker */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (sessionId.trim()) setActiveSessionId(sessionId.trim());
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          placeholder="Session ID (UUID)"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold"
        >
          Rejoindre
        </button>
      </form>

      {activeSessionId && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Session : <code>{activeSessionId}</code>
            </p>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">
                Aucun message — écrivez le premier !
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className="px-3 py-2 rounded-lg bg-gray-50 text-sm"
              >
                <p className="text-xs text-gray-400 mb-0.5">
                  {m.senderId.slice(0, 8)} ·{" "}
                  {new Date(m.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>{m.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage(input.trim());
                setInput("");
              }
            }}
            className="flex gap-2 p-3 border-t border-gray-200"
          >
            <input
              type="text"
              placeholder="Écrire un message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!connected}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={!connected || !input.trim()}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold disabled:opacity-40"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}

      <Link
        href="/"
        className="inline-block mt-6 text-sm text-gray-500 hover:text-orange-500"
      >
        ← Retour à l&apos;accueil
      </Link>
    </div>
  );
}

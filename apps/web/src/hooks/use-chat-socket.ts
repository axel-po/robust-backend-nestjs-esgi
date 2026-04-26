"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import api from "@mentor-esgi/sdk";
import { authConnection } from "@/lib/api";

export type ChatMessage =
  api.functional.sessions.messages.getAll.Output[number];

export function useChatSocket(sessionId: string | null, token: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !token) return;

    let cancelled = false;

    api.functional.sessions.messages
      .getAll(authConnection(token), sessionId)
      .then((history) => {
        if (cancelled) return;
        setMessages(history);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur historique");
      });

    const socket = io(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
      { auth: { token: `Bearer ${token}` } },
    );

    socket.on("connect", () => {
      setConnected(true);
      setError(null);
      socket.emit("join-session", { sessionId });
    });

    socket.on("new-message", (msg: ChatMessage) => {
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("connect_error", (err) => {
      setError(err.message);
      setConnected(false);
    });

    socketRef.current = socket;

    return () => {
      cancelled = true;
      socket.disconnect();
      socketRef.current = null;
      setMessages([]);
    };
  }, [sessionId, token]);

  const sendMessage = (content: string) => {
    socketRef.current?.emit("send-message", { sessionId, content });
  };

  return { messages, sendMessage, connected, error };
}

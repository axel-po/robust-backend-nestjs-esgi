"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex-demo/convex/_generated/api";
import type { Id } from "../../../../convex-demo/convex/_generated/dataModel";

// ── Icons (inline SVG) ─────────────────────────────────────
const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PlusIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LogOutIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowLeftIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UsersIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SendIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MessageCircleIcon = ({ size = 48 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size} strokeWidth={1.5}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// ── User identity (simplifié, pas d'auth Convex) ───────────
function getStoredUser(): { id: string; name: string } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("chat-user");
  return stored ? JSON.parse(stored) : null;
}

function useUser() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
  } | null>(getStoredUser);

  function login(name: string) {
    const u = { id: `user-${Date.now()}`, name };
    localStorage.setItem("chat-user", JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("chat-user");
    setUser(null);
  }

  return { user, login, logout };
}

// ── Login Screen ────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <div className="w-full max-w-sm bg-card rounded-3xl p-8 border border-gray-200 shadow-soft">
        <h1 className="text-2xl font-bold mb-2 text-center">Chat Convex</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Messagerie temps réel propulsée par Convex
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onLogin(name.trim());
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Votre pseudo..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-accent-orange text-white text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-40"
          >
            Rejoindre le chat
          </button>
          <Link
            href="/"
            className="block text-center text-xs text-gray-400 hover:text-gray-600"
          >
            Retour à l&apos;accueil
          </Link>
        </form>
      </div>
    </div>
  );
}

// ── Create Room Modal ───────────────────────────────────────
function CreateRoomModal({
  onClose,
  userId,
  userName,
}: {
  onClose: () => void;
  userId: string;
  userName: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createRoom = useMutation(api.chatRooms.create);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createRoom({
      name: name.trim(),
      description: description.trim() || "Pas de description",
      createdBy: userId,
      creatorName: userName,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-soft">
        <h2 className="text-lg font-bold mb-4">Nouvelle room</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nom de la room..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optionnel)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-accent-orange text-white text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-40"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Room Sidebar ────────────────────────────────────────────
function RoomSidebar({
  selectedRoomId,
  onSelectRoom,
  onCreateRoom,
  userId,
  userName,
  onLogout,
}: {
  selectedRoomId: Id<"chatRooms"> | null;
  onSelectRoom: (id: Id<"chatRooms">) => void;
  onCreateRoom: () => void;
  userId: string;
  userName: string;
  onLogout: () => void;
}) {
  const rooms = useQuery(api.chatRooms.list);
  const joinRoom = useMutation(api.chatMembers.join);

  async function handleSelectRoom(roomId: Id<"chatRooms">) {
    await joinRoom({ roomId, userId, userName });
    onSelectRoom(roomId);
  }

  return (
    <div className="w-72 bg-card border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            Rooms
          </h2>
          <button
            onClick={onCreateRoom}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent-orange text-white shadow-sm hover:shadow-md hover:bg-opacity-90 active:scale-95 transition-all"
            title="Nouvelle room"
            aria-label="Créer une nouvelle room"
          >
            <PlusIcon size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <span className="font-medium truncate">{userName}</span>
          <button
            onClick={onLogout}
            className="ml-auto inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Déconnexion"
            aria-label="Se déconnecter"
          >
            <LogOutIcon size={14} />
          </button>
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {rooms === undefined && (
          <p className="text-xs text-gray-400 text-center py-4">
            Chargement...
          </p>
        )}
        {rooms?.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            Aucune room — créez-en une !
          </p>
        )}
        {rooms?.map((room) => (
          <button
            key={room._id}
            onClick={() => handleSelectRoom(room._id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
              selectedRoomId === room._id
                ? "bg-accent-orange/10 border border-accent-orange/30"
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-accent-orange text-sm">#</span>
              <span className="text-sm font-medium text-gray-900 truncate">
                {room.name}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5 pl-5">
              {room.description}
            </p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-accent-orange transition-colors py-2 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeftIcon size={14} />
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>
    </div>
  );
}

// ── Message Bubble ──────────────────────────────────────────
function MessageBubble({
  message,
  isOwn,
}: {
  message: {
    _id: string;
    senderName: string;
    content: string;
    _creationTime: number;
  };
  isOwn: boolean;
}) {
  const time = new Date(message._creationTime).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? "bg-accent-orange text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold mb-0.5 text-accent-orange">
            {message.senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${isOwn ? "text-white/60" : "text-gray-400"}`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}

// ── Typing Indicator ────────────────────────────────────────
function TypingIndicator({
  roomId,
  currentUserId,
}: {
  roomId: Id<"chatRooms">;
  currentUserId: string;
}) {
  const typing = useQuery(api.typing.listByRoom, { roomId });
  const others = typing?.filter((t) => t.userId !== currentUserId);

  if (!others || others.length === 0) return null;

  const names = others.map((t) => t.userName);
  const text =
    names.length === 1
      ? `${names[0]} est en train d'écrire`
      : `${names.join(", ")} sont en train d'écrire`;

  return (
    <div className="px-4 py-1.5">
      <p className="text-xs text-gray-400 animate-pulse">{text}...</p>
    </div>
  );
}

// ── Chat Panel (messages d'une room) ────────────────────────
function ChatPanel({
  roomId,
  userId,
  userName,
}: {
  roomId: Id<"chatRooms">;
  userId: string;
  userName: string;
}) {
  const room = useQuery(api.chatRooms.getById, { roomId });
  const messages = useQuery(api.chatMessages.listByRoom, { roomId });
  const members = useQuery(api.chatMembers.listByRoom, { roomId });
  const sendMessage = useMutation(api.chatMessages.send);
  const startTyping = useMutation(api.typing.start);
  const stopTyping = useMutation(api.typing.stop);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Auto-scroll quand nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStopTyping = useCallback(() => {
    stopTyping({ roomId, userId });
  }, [stopTyping, roomId, userId]);

  function handleInputChange(value: string) {
    setInput(value);

    if (value.trim()) {
      startTyping({ roomId, userId, userName });

      // Reset le timeout de typing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(handleStopTyping, 2000);
    } else {
      handleStopTyping();
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({
      roomId,
      senderId: userId,
      senderName: userName,
      content: input.trim(),
    });
    setInput("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Chargement de la room...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Room header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-card flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="text-accent-orange">#</span>
            {room.name}
          </h2>
          <p className="text-xs text-gray-400">{room.description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
          <UsersIcon size={14} />
          <span className="font-medium">
            {members?.length ?? 0} membre{(members?.length ?? 0) > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages === undefined && (
          <p className="text-xs text-gray-400 text-center py-8">
            Chargement des messages...
          </p>
        )}
        {messages?.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="text-gray-200 mb-3">
              <MessageCircleIcon size={40} />
            </div>
            <p className="text-sm text-gray-400">
              Aucun message — lancez la conversation !
            </p>
          </div>
        )}
        {messages?.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.senderId === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      <TypingIndicator roomId={roomId} currentUserId={userId} />

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 bg-card">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Écrire un message..."
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent-orange text-white font-semibold text-sm shadow-sm hover:shadow-md hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
            aria-label="Envoyer le message"
          >
            <SendIcon size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Empty State (aucune room sélectionnée) ──────────────────
function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <div className="text-gray-200 mb-4">
          <MessageCircleIcon size={64} />
        </div>
        <h3 className="text-lg font-semibold text-gray-400 mb-1">
          Sélectionnez une room
        </h3>
        <p className="text-sm text-gray-300">
          ou créez-en une pour commencer à discuter
        </p>
      </div>
    </div>
  );
}

// ── Page principale ─────────────────────────────────────────
export default function ChatPage() {
  const { user, login, logout } = useUser();
  const [selectedRoomId, setSelectedRoomId] =
    useState<Id<"chatRooms"> | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="h-screen flex bg-background">
      <RoomSidebar
        selectedRoomId={selectedRoomId}
        onSelectRoom={setSelectedRoomId}
        onCreateRoom={() => setShowCreateRoom(true)}
        userId={user.id}
        userName={user.name}
        onLogout={logout}
      />

      {selectedRoomId ? (
        <ChatPanel
          roomId={selectedRoomId}
          userId={user.id}
          userName={user.name}
        />
      ) : (
        <EmptyState />
      )}

      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          userId={user.id}
          userName={user.name}
        />
      )}
    </div>
  );
}

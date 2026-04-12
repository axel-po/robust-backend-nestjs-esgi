import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ── Chat Rooms ────────────────────────────────────────────
  chatRooms: defineTable({
    name: v.string(),
    description: v.string(),
    createdBy: v.string(),
  }).index('by_createdBy', ['createdBy']),

  // ── Chat Members (qui est dans quelle room) ──────────────
  chatMembers: defineTable({
    roomId: v.id('chatRooms'),
    userId: v.string(),
    userName: v.string(),
  })
    .index('by_roomId', ['roomId'])
    .index('by_userId', ['userId'])
    .index('by_roomId_and_userId', ['roomId', 'userId']),

  // ── Chat Messages ─────────────────────────────────────────
  chatMessages: defineTable({
    roomId: v.id('chatRooms'),
    senderId: v.string(),
    senderName: v.string(),
    content: v.string(),
  }).index('by_roomId', ['roomId']),

  // ── Typing Indicators (high-churn, table séparée) ────────
  typingIndicators: defineTable({
    roomId: v.id('chatRooms'),
    userId: v.string(),
    userName: v.string(),
  })
    .index('by_roomId', ['roomId'])
    .index('by_roomId_and_userId', ['roomId', 'userId']),
});

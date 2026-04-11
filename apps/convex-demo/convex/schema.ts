import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  notifications: defineTable({
    userId: v.string(),
    type: v.union(v.literal('NEW_REQUEST'), v.literal('REQUEST_ACCEPTED'), v.literal('NEW_MESSAGE')),
    message: v.string(),
    isRead: v.boolean(),
  }),
});

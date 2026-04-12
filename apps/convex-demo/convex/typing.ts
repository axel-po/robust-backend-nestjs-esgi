import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Lister qui est en train de taper dans une room — real-time
 */
export const listByRoom = query({
  args: { roomId: v.id('chatRooms') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('typingIndicators')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .take(20);
  },
});

/**
 * Signaler qu'on est en train de taper
 */
export const start = mutation({
  args: {
    roomId: v.id('chatRooms'),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Vérifier si déjà marqué comme "typing"
    const existing = await ctx.db
      .query('typingIndicators')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId),
      )
      .take(1);

    if (existing.length > 0) {
      return existing[0]._id;
    }

    return await ctx.db.insert('typingIndicators', {
      roomId: args.roomId,
      userId: args.userId,
      userName: args.userName,
    });
  },
});

/**
 * Arrêter l'indicateur de frappe
 */
export const stop = mutation({
  args: {
    roomId: v.id('chatRooms'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const indicators = await ctx.db
      .query('typingIndicators')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId),
      )
      .take(1);

    for (const indicator of indicators) {
      await ctx.db.delete(indicator._id);
    }
  },
});

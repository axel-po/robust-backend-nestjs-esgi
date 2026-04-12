import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Lister les membres d'une room — real-time
 */
export const listByRoom = query({
  args: { roomId: v.id('chatRooms') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('chatMembers')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .take(100);
  },
});

/**
 * Vérifier si un utilisateur est membre d'une room
 */
export const isMember = query({
  args: { roomId: v.id('chatRooms'), userId: v.string() },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query('chatMembers')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId),
      )
      .take(1);

    return member.length > 0;
  },
});

/**
 * Rejoindre une room
 */
export const join = mutation({
  args: {
    roomId: v.id('chatRooms'),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Vérifier si déjà membre
    const existing = await ctx.db
      .query('chatMembers')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId),
      )
      .take(1);

    if (existing.length > 0) {
      return existing[0]._id;
    }

    return await ctx.db.insert('chatMembers', {
      roomId: args.roomId,
      userId: args.userId,
      userName: args.userName,
    });
  },
});

/**
 * Quitter une room
 */
export const leave = mutation({
  args: {
    roomId: v.id('chatRooms'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query('chatMembers')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId),
      )
      .take(1);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Aussi supprimer les typing indicators
    const typing = await ctx.db
      .query('typingIndicators')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId),
      )
      .take(1);

    for (const t of typing) {
      await ctx.db.delete(t._id);
    }
  },
});

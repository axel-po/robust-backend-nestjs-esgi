import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Lister toutes les rooms (les 50 plus récentes)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('chatRooms').order('desc').take(50);
  },
});

/**
 * Récupérer une room par son ID
 */
export const getById = query({
  args: { roomId: v.id('chatRooms') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

/**
 * Lister les rooms auxquelles un utilisateur appartient
 */
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query('chatMembers')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .take(50);

    const rooms = await Promise.all(
      memberships.map((m) => ctx.db.get(m.roomId)),
    );

    return rooms.filter((r) => r !== null);
  },
});

/**
 * Créer une room + auto-join du créateur
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    createdBy: v.string(),
    creatorName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert('chatRooms', {
      name: args.name,
      description: args.description,
      createdBy: args.createdBy,
    });

    // Auto-join le créateur
    await ctx.db.insert('chatMembers', {
      roomId,
      userId: args.createdBy,
      userName: args.creatorName,
    });

    return roomId;
  },
});

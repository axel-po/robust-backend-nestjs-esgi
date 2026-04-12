import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Lister les messages d'une room — real-time via useQuery()
 * Retourne les 100 derniers messages (ordre chronologique)
 */
export const listByRoom = query({
  args: { roomId: v.id('chatRooms') },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('chatMessages')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .order('desc')
      .take(100);

    // Remettre en ordre chronologique (plus ancien → plus récent)
    return messages.reverse();
  },
});

/**
 * Envoyer un message dans une room
 */
export const send = mutation({
  args: {
    roomId: v.id('chatRooms'),
    senderId: v.string(),
    senderName: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert('chatMessages', {
      roomId: args.roomId,
      senderId: args.senderId,
      senderName: args.senderName,
      content: args.content,
    });

    // Supprimer l'indicateur de frappe après envoi
    const typing = await ctx.db
      .query('typingIndicators')
      .withIndex('by_roomId_and_userId', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.senderId),
      )
      .take(1);

    for (const t of typing) {
      await ctx.db.delete(t._id);
    }

    return messageId;
  },
});

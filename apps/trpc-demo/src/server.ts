import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { z } from "zod";

// Init
const t = initTRPC.create();

interface Feedback {
  id: string;
  mentorId: string;
  menteeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const feedbacks: Feedback[] = [];

const appRouter = t.router({
  getFeedbacks: t.procedure
    .input(z.object({ mentorId: z.string() }))
    .query(({ input }) => {
      return feedbacks.filter((f) => f.mentorId === input.mentorId);
    }),

  // Mutation : créer un avis
  createFeedback: t.procedure
    .input(
      z.object({
        mentorId: z.string(),
        menteeId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1),
      }),
    )
    .mutation(({ input }) => {
      const feedback: Feedback = {
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date(),
      };
      feedbacks.push(feedback);
      return feedback;
    }),
});

// Export du type pour le client (type-safety end-to-end)
export type AppRouter = typeof appRouter;

// Serveur Express + tRPC
const app = express();

app.use(cors({ origin: "*" }));
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

app.listen(3001, () => {
  console.log("tRPC server running on http://localhost:3001");
});

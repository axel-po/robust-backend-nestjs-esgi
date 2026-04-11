# Rapport : tRPC — API type-safe sans génération de code

## Qu'est-ce que tRPC ?

tRPC est un framework TypeScript qui permet de créer des API **type-safe end-to-end** entre le serveur et le client, sans génération de code ni schéma intermédiaire. Le client connaît automatiquement les types de chaque route grâce à l'inférence TypeScript.

## Comment ça fonctionne ?

### Côté serveur — Définir un router

Le serveur définit des **procedures** (query pour la lecture, mutation pour l'écriture) avec validation Zod :

```typescript
const appRouter = t.router({
  getFeedbacks: t.procedure
    .input(z.object({ mentorId: z.string() }))
    .query(({ input }) => {
      return feedbacks.filter((f) => f.mentorId === input.mentorId);
    }),

  createFeedback: t.procedure
    .input(z.object({
      mentorId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().min(1),
    }))
    .mutation(({ input }) => {
      const feedback = { id: crypto.randomUUID(), ...input, createdAt: new Date() };
      feedbacks.push(feedback);
      return feedback;
    }),
});

// Ce type est partagé avec le client
export type AppRouter = typeof appRouter;
```

### Côté client — Appeler les routes avec autocomplete

Le client importe uniquement le **type** `AppRouter` (pas le code serveur). TypeScript infère automatiquement les paramètres et le retour de chaque route :

```typescript
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../trpc-demo/src/server";

const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3001/trpc" })],
});

// Typé automatiquement — input et output connus
const feedbacks = await trpc.getFeedbacks.query({ mentorId: "mentor-1" });
const newFeedback = await trpc.createFeedback.mutate({ mentorId: "mentor-1", rating: 5, comment: "Super !" });
```

## Comparaison avec Nestia SDK (notre projet NestJS)

| Critère | Nestia SDK | tRPC |
|---------|-----------|------|
| Type-safety | Oui | Oui |
| Génération de code | Oui (`npx @nestia/sdk sdk`) | Non (inférence TypeScript) |
| Schéma de validation | Typia (compile-time) | Zod (runtime) |
| Transport | HTTP REST classique | HTTP RPC (batch possible) |
| Swagger/OpenAPI | Oui (auto-généré) | Non |
| Utilisable hors TypeScript | Oui (via REST/Swagger) | Non (TypeScript only) |

**tRPC** est plus simple à mettre en place (pas de génération), mais fonctionne uniquement dans un écosystème TypeScript. **Nestia SDK** génère un client typé mais produit aussi un Swagger, ce qui permet à des clients non-TypeScript (mobile, Postman) de consommer l'API.

Dans notre projet, tRPC est utilisé pour le système de feedback (mini-feature isolée), tandis que l'API principale reste en NestJS avec Nestia pour bénéficier de l'architecture modulaire (guards, decorators, cache Redis, WebSocket).

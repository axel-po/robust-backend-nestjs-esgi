# Rapport : Convex — Backend réactif temps réel

## 1. Qu'est-ce que Convex ?

Convex est un **Backend-as-a-Service (BaaS)** qui fournit une base de données réactive, des fonctions serverless et une synchronisation temps réel automatique. Contrairement à une architecture classique (NestJS + PostgreSQL + Redis + WebSocket), Convex gère l'ensemble de l'infrastructure backend dans le cloud.

### Positionnement par rapport aux alternatives

| Critère | NestJS + PostgreSQL | Firebase/Firestore | Convex |
|---------|--------------------|--------------------|--------|
| Type | Framework backend custom | BaaS Google | BaaS indépendant |
| Base de données | PostgreSQL (relationnelle) | NoSQL (documents) | NoSQL (documents) + relationnel |
| Temps réel | Manuel (WebSocket) | Intégré | Intégré |
| Cache | Manuel (Redis) | Automatique côté client | Automatique côté client |
| Typage | TypeScript via Nestia/Typia | Partiel | TypeScript natif end-to-end |
| Hébergement | Auto-hébergé | Google Cloud | Convex Cloud |

Convex se distingue par son approche **"database-as-a-function"** : les requêtes sont des fonctions TypeScript qui s'exécutent côté serveur, et les résultats se synchronisent automatiquement côté client sans configuration supplémentaire.

---

## 2. Architecture et concepts fondamentaux

### 2.1 Schéma de données

Le schéma est défini en TypeScript avec un système de validation intégré via `convex/values` :

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notifications: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("NEW_REQUEST"),
      v.literal("REQUEST_ACCEPTED"),
      v.literal("NEW_MESSAGE")
    ),
    message: v.string(),
    isRead: v.boolean(),
  }),
});
```

Convex utilise son propre validateur de schéma (`v.string()`, `v.boolean()`, `v.union()`, etc.) similaire à Zod mais optimisé pour son runtime. Quand on lance `npx convex dev`, le schéma est automatiquement déployé — pas de migrations manuelles comme avec Drizzle/PostgreSQL.

### 2.2 Fonctions serveur : Query, Mutation, Action

Convex distingue trois types de fonctions :

**Query** — Lecture de données (équivalent d'un GET). Les queries sont **réactives** : si les données changent en base, tous les clients abonnés reçoivent automatiquement la mise à jour.

```typescript
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});
```

**Mutation** — Écriture de données (équivalent d'un POST/PATCH/DELETE). Les mutations sont transactionnelles et déclenchent automatiquement la mise à jour des queries abonnées.

```typescript
export const create = mutation({
  args: {
    userId: v.string(),
    type: v.union(v.literal("NEW_REQUEST"), v.literal("REQUEST_ACCEPTED"), v.literal("NEW_MESSAGE")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
    });
  },
});
```

**Action** — Fonctions qui peuvent appeler des API externes (non utilisé dans notre démo). Les actions ne sont pas transactionnelles et ne peuvent pas accéder directement à la base.

### 2.3 Réactivité automatique

Le point central de Convex est la **réactivité sans configuration**. Côté client React :

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function NotificationsList({ userId }) {
  // Cette query se met à jour AUTOMATIQUEMENT quand les données changent
  const notifications = useQuery(api.notifications.getByUser, { userId });

  // Mutation pour créer une notification
  const createNotification = useMutation(api.notifications.create);

  return (
    <div>
      {notifications?.map((n) => <div key={n._id}>{n.message}</div>)}
      <button onClick={() => createNotification({ userId, type: "NEW_REQUEST", message: "Test" })}>
        Notifier
      </button>
    </div>
  );
}
```

Quand un autre utilisateur crée une notification, tous les clients qui affichent la liste la voient apparaître **instantanément** sans aucun polling, WebSocket manuel, ou invalidation de cache.

---

## 3. Comparaison avec NestJS dans le projet Mentor ESGI

### 3.1 Temps réel : WebSocket vs Convex

Dans notre projet NestJS, le chat en temps réel nécessite :
- Un `MessagesGateway` WebSocket avec Socket.io
- Une authentification JWT dans le handshake
- Un système de rooms par session
- Un broadcast manuel après chaque message

Avec Convex, la même fonctionnalité se réduit à une query réactive et une mutation. Pas de WebSocket à configurer, pas de rooms, pas de broadcast — Convex gère tout.

### 3.2 Cache : Redis vs Convex

Dans NestJS, nous avons configuré :
- Redis dans Docker
- `@nestjs/cache-manager` avec `cache-manager-redis-yet`
- Des décorateurs `@CacheInterceptor` et `@CacheTTL` sur chaque endpoint

Convex n'a pas besoin de cache externe. Le SDK client maintient un cache local qui se synchronise automatiquement avec le serveur. Les données sont toujours à jour sans TTL ni invalidation manuelle.

### 3.3 Ce que Convex ne fait pas

Convex n'est pas adapté à tous les cas :
- **Pas de SQL** : pas de jointures complexes, pas d'agrégations avancées
- **Vendor lock-in** : les données sont hébergées chez Convex, pas exportables facilement
- **Pas de contrôle infrastructure** : impossible de tuner la base, pas de réplicas custom
- **Coût en production** : gratuit en dev, payant avec du trafic

Pour un projet comme Mentor ESGI avec des relations complexes (mentors, mentees, sessions, messages), PostgreSQL avec Drizzle ORM reste plus adapté. Convex est idéal pour des fonctionnalités isolées nécessitant du temps réel (notifications, présence en ligne, chat simple).

### 3.4 Tableau récapitulatif

| Fonctionnalité | NestJS (notre projet) | Convex (notre démo) |
|---|---|---|
| Schéma | Drizzle ORM + migrations | `schema.ts` auto-déployé |
| Validation | Typia + Nestia | `convex/values` intégré |
| API | Controllers + Services + Repositories | Fonctions query/mutation |
| Temps réel | WebSocket Gateway + Socket.io | Automatique (useQuery) |
| Cache | Redis + CacheInterceptor | Cache client automatique |
| Auth | JWT custom + Guards | Convex Auth (optionnel) |
| Déploiement | Docker + VPS | `npx convex deploy` |
| Lignes de code (notif.) | ~150 lignes | ~40 lignes |

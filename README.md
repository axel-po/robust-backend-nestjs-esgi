# MentorESGI

Plateforme de mise en relation entre mentors et mentorés (Projet M2 ESGI T2 2026 par Axel Pointud)

## Structure

```
project-mentor-esgi/
├── apps/
│   ├── api/      → NestJS (backend REST + WebSocket)
│   └── web/      → Next.js (frontend)
├── packages/
│   └── types/    → Types TypeScript partagés
```

## Monorepo

Ce projet utilise [Turborepo](https://turbo.build/repo/docs) pour orchestrer le monorepo : build parallèle, cache des tâches, et exécution optimisée des scripts entre les apps.

## Prérequis

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io) >= 9

```bash
npm install -g pnpm
```

## Installation

```bash
pnpm install
```

## Développement

Lancer toutes les apps en parallèle depuis la racine :

```bash
pnpm dev
```

Lancer une app spécifique :

```bash
# API uniquement (port 3001)
pnpm --filter @mentor-esgi/api dev

# Web uniquement (port 3000)
pnpm --filter @mentor-esgi/web dev
```

## Build

```bash
# Build tout le monorepo
pnpm build

# Build une app spécifique
pnpm --filter @mentor-esgi/api build
pnpm --filter @mentor-esgi/web build
```

## Lint

```bash
# Lint tout le monorepo
pnpm lint

# Lint une app spécifique
pnpm --filter @mentor-esgi/api lint
pnpm --filter @mentor-esgi/web lint
```

## Tests (API)

```bash
# Tests unitaires
pnpm --filter @mentor-esgi/api test

# Tests e2e
pnpm --filter @mentor-esgi/api test:e2e

# Couverture
pnpm --filter @mentor-esgi/api test:cov
```

## Variables d'environnement

Copier le fichier d'exemple dans chaque app :

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Ports par défaut

| App | Port |
|-----|------|
| API (NestJS) | 8080 |
| Web (Next.js) | 3000 |

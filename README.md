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

## Génération Nestia (Swagger & SDK)

```bash
# Générer la documentation Swagger (swagger.json)
pnpm --filter @mentor-esgi/api swagger:generate

# Générer le SDK TypeScript (consommé par apps/web)
pnpm --filter @mentor-esgi/api sdk:generate

# Générer les deux à la fois
pnpm --filter @mentor-esgi/api generate
```

Une fois le `swagger.json` généré et l'API lancée, la documentation Swagger UI est accessible sur :

👉 [http://localhost:8080/docs](http://localhost:8080/docs)

## Variables d'environnement

```bash
cp .env.example .env
```

## Docker

### Dev — PostgreSQL uniquement

```bash
# Démarrer la base de données
docker compose up -d

# Arrêter
docker compose down

# Supprimer les données
docker compose down -v
```

### Prod — Tout dockerisé

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Ports par défaut

| Service | Port |
|---------|------|
| API (NestJS) | 8080 |
| Web (Next.js) | 3000 |
| PostgreSQL | 5432 |

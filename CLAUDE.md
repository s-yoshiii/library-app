# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server with hot reload (ts-node-dev)
yarn lint         # Run ESLint
yarn lint:fix     # Run ESLint with auto-fix
yarn format       # Run Prettier on src/**/*.ts
```

`git commit` triggers a pre-commit hook (husky + lint-staged) that automatically runs `prettier --write` then `eslint --fix` on staged `.ts` files.

## Stack

- **Runtime**: Node.js 25 (CommonJS)
- **Language**: TypeScript 6 — strict mode, `module: nodenext`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` enabled
- **Framework**: Express 5
- **ORM**: Prisma 7
- **Package manager**: Yarn (use `yarn`, not `npm`)

## Architecture

This project follows a **Layered Architecture → Clean Architecture** learning path. As the course progresses, `src/` will be organized into layers. The entry point is `src/app.ts`.

Expected layer structure (to be built out):

```
src/
├── app.ts              # Express app setup and server entry point
├── presentation/       # HTTP layer: routes, controllers, request/response types
├── application/        # Use cases / application services
├── domain/             # Entities, value objects, repository interfaces
└── infrastructure/     # Prisma repositories, external services
```

## TypeScript notes

- `"types": []` in tsconfig.json explicitly opts out of auto-included type definitions. If `@types/node` globals (e.g. `process`, `Buffer`) are needed, add `"types": ["node"]`.
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports.
- VSCode is configured to use the workspace TypeScript (`node_modules/typescript/lib`) via `.vscode/settings.json`.

## Environment variables

Copy `.env.example` to `.env` and fill in values before running locally. Prisma requires `DATABASE_URL`.

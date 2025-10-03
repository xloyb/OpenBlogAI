# OpenBlogAI - Copilot Instructions

## Architecture Overview

OpenBlogAI is a full-stack blog generation platform with two main components:

- **Client** (`openblogaiclient/`): Next.js 15 app with NextAuth, TailwindCSS + DaisyUI, Framer Motion
- **Server** (`server/`): Express.js API with Prisma ORM, JWT auth, Redis, AI integrations

### Key Data Flow

1. Users authenticate via NextAuth (client) → Express JWT (server)
2. YouTube videos → transcripts → AI blog generation → Prisma storage
3. Client fetches blogs via `/api/blog` endpoints with session management

## Critical Architecture Patterns

### Dual Authentication System

- **Client**: NextAuth 5 (beta) with credentials provider (`openblogaiclient/auth/auth.ts`)
- **Server**: JWT with refresh tokens (`server/src/utils/jwt.ts`)
- Tokens bridge: Client exchanges NextAuth session for server JWT tokens
- **Key Pattern**: Access tokens expire in 1 minute, refresh tokens in 7 days

### Path Alias System

Server uses TypeScript path aliases extensively:

```typescript
import authRoutes from "@routes/authRoutes";
import { setupCSRF } from "@src/middlewares/csrfMiddleware";
```

Configure via `tsconfig.json` paths and `tsc-alias` build step.

### Database State

**IMPORTANT**: Prisma schema is currently commented out - database models are inactive.
Check `server/prisma/schema.prisma` before any database operations.

## Development Workflows

### Starting the Stack

```bash
# Client (port 3000)
cd openblogaiclient && npm run dev

# Server (port 8082)
cd server && npm run dev
```

### AI Integration Points

Server integrates multiple AI providers:

- OpenAI SDK (`@ai-sdk/openai`)
- Azure AI (`@azure-rest/ai-inference`)
- Hugging Face (`@huggingface/inference`)
- YouTube transcript processing (`youtube-transcript`, `youtubei`)

### Build Process

- **Client**: Standard Next.js build
- **Server**: TypeScript compilation + `tsc-alias` for path resolution
- **Deployment**: PM2 with `ecosystem.config.js`

## Project-Specific Conventions

### Error Handling

Centralized error middleware in `server/src/utils/errorHandler.ts`:

```typescript
// Controllers use next(error) pattern
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ... logic
  } catch (error) {
    next(error); // Global handler processes this
  }
};
```

### API Structure

Server follows service-controller pattern:

- **Routes** (`/routes`): Define endpoints
- **Controllers** (`/controllers`): Handle requests, validation
- **Services** (`/services`): Business logic, database operations

### Client Components

- **Layout**: Commented out sidebar navigation (see `layout.tsx`)
- **Auth**: SessionProvider wrapper with SessionUpdater component
- **Styling**: TailwindCSS + DaisyUI for component library

## Security & Middleware Stack

### Server Security Pipeline

1. **Helmet**: Security headers
2. **CORS**: Configured for `localhost:3001`, `localhost:3002`
3. **Rate Limiting**: 100 requests/15min (currently disabled)
4. **CSRF**: Available but disabled (`setupCSRF`)
5. **Global Logging**: Winston logger in `middlewares/globalLogger.ts`

### Client Route Protection

`src/middleware.ts` handles:

- Public routes: `/login`, `/register`, `/products`
- Protected subroutes: `/checkout`, `/blogs`
- Auto-redirect authenticated users from login to `/blogs`

## Key Files for Context

- `server/src/index.ts`: Main server configuration and middleware setup
- `openblogaiclient/auth/auth.ts`: NextAuth configuration and token refresh logic
- `server/src/utils/jwt.ts`: JWT generation with user role permissions
- `server/src/services/blogService.ts`: Blog CRUD operations (when DB active)
- `openblogaiclient/src/middleware.ts`: Route protection logic

## Common Gotchas

1. **Database**: Prisma schema is commented out - activate models before DB operations
2. **Ports**: Client (3000), Server (8082) - CORS configured accordingly
3. **Tokens**: Very short-lived access tokens (1min) require active refresh handling
4. **Path Aliases**: Server uses `@src/`, `@routes/` etc. - check tsconfig paths
5. **NextAuth**: Using beta v5 - some APIs differ from v4 documentation

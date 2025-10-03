# OpenBlogAI 🤖✍️

> Transform YouTube videos into SEO-optimized blog posts using AI in under 60 seconds

OpenBlogAI is a full-stack blog generation platform that leverages artificial intelligence to automatically convert YouTube videos into comprehensive, SEO-optimized blog posts. Built with modern web technologies and multiple AI providers for maximum flexibility and performance.

## � Project Journey & V1 Beta Release

After months of being away due to university commitments, I'm excited to announce the **V1 Beta release** of OpenBlogAI! This project represents a significant milestone in making AI-powered content creation accessible to everyone.

### What's New in V1 Beta

- **Complete Role-Based Access Control (RBAC)**: Comprehensive user management system with multiple permission levels
- **Advanced Content Moderation**: Built-in moderation tools for community-driven content
- **OpenRouter Integration**: Access to dozens of AI models for free and premium tiers
- **Enhanced User Experience**: Completely redesigned interface with modern, responsive design
- **Production-Ready Architecture**: Scalable backend with Redis caching and security hardening

### 🔐 User Roles & Permissions System

- **👤 Regular Users**: Create and manage personal blogs, basic AI model access
- **✅ Verified Posters**: Enhanced privileges, access to premium AI models, public blog publishing
- **🛡️ Moderators**: Content moderation tools, user management, community oversight
- **👑 Administrators**: Full system access, user role management, platform configuration

### 🤖 AI Model Ecosystem via OpenRouter

Thanks to OpenRouter integration, users can access a vast array of AI models:

- **Free Tier Models**: Mistral 7B, Llama variants, and other open-source models
- **Premium Models**: GPT-4, Claude, Gemini Pro, and cutting-edge AI systems
- **Specialized Models**: Code-focused, creative writing, and domain-specific AI models
- **Cost-Effective**: Pay-per-use pricing with transparent costs and usage tracking

## �🌟 Features

### Core Functionality

- **YouTube to Blog Conversion**: Extract transcripts from YouTube videos and generate high-quality blog posts
- **Multi-AI Provider Support**: Access 40+ AI models via OpenRouter, including free and premium options
- **Real-time Processing**: Generate blogs in under 60 seconds with live progress tracking
- **Advanced SEO Optimization**: Built-in SEO scoring, structured data, and optimization recommendations
- **Role-Based Access Control**: Comprehensive user management with Admin, Moderator, and Verified Poster roles
- **Content Moderation System**: Built-in tools for community content oversight and quality control

### Modern Web Features

- **Responsive Design**: Mobile-first design with comprehensive breakpoint system
- **Interactive UI**: Smooth animations with Framer Motion and modern design patterns
- **Progressive Enhancement**: Works offline with intelligent caching strategies
- **Type Safety**: Full TypeScript implementation across the stack

### Performance & Scalability

- **Redis Caching**: Intelligent caching with stampede prevention for public content
- **Database Optimization**: Prisma ORM with MySQL for efficient data management
- **Smart Pagination**: Server-side pagination with search and filtering
- **Rate Limiting**: Built-in API protection against abuse

### Security & Authentication

- **Dual Authentication System**: NextAuth 5 (client) + JWT tokens (server)
- **Role-based Access Control**: Admin, moderator, and verified poster roles
- **CSRF Protection**: Built-in security against cross-site request forgery
- **Token Management**: Automatic refresh token rotation and security

## 🏗️ Architecture

### Tech Stack

**Frontend (openblogaiclient/)**

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS 4 + DaisyUI components
- **Animations**: Framer Motion for smooth interactions
- **Authentication**: NextAuth 5 (beta) with credentials provider
- **State Management**: React hooks with server state synchronization
- **Type Safety**: TypeScript with strict configuration

**Backend (server/)**

- **Runtime**: Node.js with Express.js
- **Database**: MySQL with Prisma ORM
- **Caching**: Redis with ioredis client
- **Authentication**: JWT with refresh token rotation
- **Security**: Helmet, CORS, rate limiting, CSRF protection
- **Logging**: Winston with structured logging
- **Validation**: Zod schemas for type-safe validation

**AI Integrations**

- **OpenRouter**: Universal AI gateway with access to 40+ models (free and premium)
- **OpenAI**: GPT models via @ai-sdk/openai
- **Azure AI**: Azure AI services integration
- **Hugging Face**: Open-source models via @huggingface/inference
- **YouTube Processing**: Multiple transcript extraction methods

### Data Flow

1. **Authentication**: User logs in → NextAuth session → JWT token exchange
2. **Content Creation**: YouTube URL → Transcript extraction → AI processing → Blog generation
3. **Caching**: Public blogs cached in Redis with intelligent invalidation
4. **SEO Processing**: Generated content → SEO analysis → Structured data → Search optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MySQL database
- Redis server (optional but recommended)
- API keys for AI providers (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/xloyb/OpenBlogAI.git
cd OpenBlogAI
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../openblogaiclient
npm install
```

3. **Environment Setup**

**Server (.env)**

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/openblogai"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-here"
REFRESH_SECRET="your-super-secret-refresh-key-here"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server Configuration
PORT=8082
BCRYPT_SALT_ROUNDS=10

# Redis (optional)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD=""  # Optional

# AI Providers (optional)
OPENROUTER_API_KEY="your-openrouter-key"  # Access to 40+ AI models
HUGGING_FACE_API_TOKEN="your-hf-token"
GITHUB_API="your-github-token"  # For additional integrations
```

**Client (.env.local)**

```env
# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Server Connection
NEXT_PUBLIC_SERVER_URL="http://localhost:8082"
```

4. **Database Setup**

```bash
cd server
npx prisma generate
npx prisma db push
```

5. **Start Development Servers**

```bash
# Terminal 1: Start the server (port 8082)
cd server
npm run dev

# Terminal 2: Start the client (port 3000)
cd openblogaiclient
npm run dev
```

Visit `http://localhost:3000` to access the application!

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Blog Endpoints

- `GET /api/blog/public/blogs` - Public blogs with pagination/search
- `GET /api/blog/user/blogs` - User's private blogs
- `POST /api/blog/create` - Create new blog
- `PUT /api/blog/:id` - Update blog
- `DELETE /api/blog/:id` - Delete blog

### Video & Transcript Endpoints

- `POST /api/transcript/extract` - Extract YouTube transcript
- `GET /api/transcript/:videoId` - Get video transcript
- `POST /api/video/upload` - Register new video

## 🛠️ Development

### Project Structure

```
OpenBlogAI/
├── openblogaiclient/          # Next.js frontend
│   ├── src/app/               # App Router pages
│   ├── components/            # Reusable components
│   ├── lib/                   # Client utilities
│   ├── auth/                  # Authentication config
│   └── types/                 # TypeScript definitions
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # API routes
│   │   └── utils/             # Shared utilities
│   └── prisma/                # Database schema
└── docs/                      # Documentation
```

### Key Development Features

**Server**

- **Path Aliases**: Clean imports with `@src/`, `@routes/`, etc.
- **Type Safety**: Zod validation for all API inputs
- **Error Handling**: Centralized error middleware
- **Logging**: Structured logging with Winston
- **Hot Reload**: Nodemon for development

**Client**

- **App Router**: Next.js 15 with server components
- **Type Safety**: TypeScript with strict configuration
- **Modern CSS**: TailwindCSS 4 with utility-first approach
- **Component Library**: DaisyUI for consistent design
- **Performance**: Automatic code splitting and optimization

### Development Commands

**Server**

```bash
npm run dev      # Development with hot reload
npm run build    # TypeScript compilation
npm start        # Production server
```

**Client**

```bash
npm run dev      # Development with Turbopack
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint checking
```

## 🚀 Deployment

### Production Build

```bash
# Build server
cd server
npm run build
npm start

# Build client
cd openblogaiclient
npm run build
npm start
```

### PM2 Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js
```

### Environment Variables (Production)

- Set `NODE_ENV=production`
- Configure proper database URLs
- Set strong JWT secrets
- Configure Redis for production
- Set proper CORS origins

## 🔧 Configuration

### Redis Cache Configuration

The application uses Redis for intelligent caching:

- **Public blogs**: Cached with automatic invalidation
- **Stampede prevention**: Prevents duplicate API calls
- **Graceful fallback**: Works without Redis (performance impact)

### AI Provider Configuration

Multiple AI providers supported:

- **OpenAI**: Premium models with high quality
- **Azure AI**: Enterprise-grade AI services
- **Hugging Face**: Open-source models (free tier available)

### Database Schema

Key models:

- **User**: Authentication, roles, permissions
- **Blog**: Content, SEO data, visibility settings
- **Video**: YouTube video metadata
- **Transcript**: Extracted video transcripts
- **RefreshToken**: Secure token management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
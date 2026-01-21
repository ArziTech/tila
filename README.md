# TILA - Today I've Learned About

<div align="center">

![Version](https://img.shields.io/badge/version-0.2.0--alpha-orange)
![Status](https://img.shields.io/badge/status-Phase_1_MVP-90%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![License](https://img.shields.io/badge/license-TBD-gray)

**A gamified personal learning management platform for self-hosted deployment**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Overview

**TILA** (Today I've Learned About) is a self-hosted, gamified learning management platform designed to help students and autodidacts track, organize, and celebrate their daily learning journey.

### Why TILA?

- **Gamification-First**: Points, streaks, and levels transform learning into an engaging game
- **Daily Focus**: Built around tracking what you learned *today* to build consistent habits
- **Self-Hosted**: Complete control over your data with privacy-first architecture
- **Simple by Design**: One core purpose - track learning progress without feature bloat

### Core Philosophy

> **"Do one thing well"** - TILA focuses exclusively on personal learning tracking with gamification. No social feeds, no course marketplaces, no distractions. Just you, your learning journey, and the satisfaction of progress.

---

## 🎯 Features

### Authentication & Security
- ✅ Email/password registration with verification
- ✅ Secure session management (NextAuth.js v5)
- ✅ Protected routes with role-based access
- 🔄 Google OAuth (planned)

### Learning Tracking
- ✅ Create, read, update, and delete learning items
- ✅ Categorize items with custom colors
- ✅ Mark items as complete with difficulty levels (Beginner, Intermediate, Advanced)
- ✅ Track study duration per item

### Todo/Backlog Management
- ✅ 5-status workflow (Backlog, To Do, In Progress, Review, Done)
- ✅ Filter and sort by status and date
- ✅ Convert completed todos to learning items
- ✅ Reorderable task list

### Gamification System
- ✅ Points calculation with difficulty multipliers
- ✅ Streak tracking (current & longest)
- ✅ Level progression system
- ✅ Activity-based bonuses
- 🏆 Achievement badges (planned)

### Dashboard & Analytics
- ✅ Statistics overview with visual charts
- ✅ Current streak and longest streak display
- ✅ Total hours learned
- ✅ Level progression indicator
- ✅ Recent activity feed

### Profile Management
- ✅ Edit name, username, and email
- ✅ Emoji-based avatar selection
- ✅ Public/private profile toggle
- ✅ Email verification with Resend

---

## 🛠 Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router) with React 19
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) primitives with Shadcn/ui patterns
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- [TanStack Query](https://tanstack.com/query) for server state

**Backend**
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [NextAuth.js v5](https://authjs.dev/) (Credentials provider)
- [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- [Resend](https://resend.com/) for email verification

**Development**
- [Biome](https://biomejs.dev/) for linting and formatting
- [Bun](https://bun.sh/) as package manager
- [Docker](https://www.docker.com/) for local development

---

## 📦 Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Bun (recommended) or npm/yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArziTech/tila.git
   cd tila
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-random-secret-here"

   # Email (optional - see Self-Hosted Mode below)
   RESEND_API_KEY="re_xxxxx"
   RESEND_FROM_ADDRESS="TILA <noreply@yourdomain.com>"
   ALLOW_UNVERIFIED_USER="false"
   ```

4. **Start PostgreSQL (Docker)**
   ```bash
   docker-compose -f docker-compose.dev.yaml up -d
   ```

5. **Initialize database**
   ```bash
   bunx --bun prisma generate
   bunx --bun prisma db push
   ```

6. **Start development server**
   ```bash
   bun run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Self-Hosted Mode (No Email Service)

For self-hosted deployments without email service, set:
```env
ALLOW_UNVERIFIED_USER=true
```

This disables email verification requirements - users are automatically verified on registration.

### Email Verification

To enable email verification:
1. Get a free API key from [Resend](https://resend.com/api-keys)
2. Verify your domain at [resend.com/domains](https://resend.com/domains)
3. Set environment variables:
   ```env
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_ADDRESS="TILA <noreply@yourdomain.com>"
   ```

**Note:** Using the default testing domain (`onboarding@resend.dev`) only allows sending emails to your registered Resend account email.

### Development Mode

In development mode, plain text passwords are accepted for testing (bypasses bcrypt). **Never deploy with development mode enabled.**

---

## 📚 Documentation

- [Project Documentation](./PROJECT.md) - Detailed project overview, architecture, and roadmap
- [Email Verification Guide](./docs/EMAIL_VERIFICATION.md) - Email system documentation
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute (coming soon)

---

## 🗺 Roadmap

### Phase 1: MVP (Current) - 90% Complete
**Target:** Q1 2026

- ✅ Authentication, Learning Tracking, Todos, Categories
- ✅ Gamification (points, streaks, levels)
- ✅ Dashboard and Profile management
- ⏳ Certificate generation
- ⏳ Google OAuth integration

### Phase 2: Gamification & Management
**Target:** Q2-Q3 2026

- 🏆 Achievement badges (20+ milestones)
- 📅 Scheduling system with reminders
- 👥 Limited social features (friends, progress viewing)
- 📝 Internal blogging for learning items
- 📊 Advanced analytics and export

### Phase 3: AI & Advanced Features
**Target:** Q4 2026 (Aspirational)

- 🤖 Tila Bot (AI assistant for recommendations)
- 🧠 Smart auto-categorization
- 📚 Learning path generation
- 📄 Content summarization

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically on push

**Database:** Use managed PostgreSQL (Supabase, Neon, or Railway)

### Docker

```bash
docker build -t tila .
docker-compose -f docker-compose.prod.yaml up -d
```

### VPS

```bash
bun install -g pm2
pm2 start bun --name "tila" -- run start
pm2 save
pm2 startup
```

See [Deployment Documentation](./PROJECT.md#deployment-strategy) for details.

---

## 🤝 Contributing

**Note:** This is currently a solo project. External contributions are not accepted at this time.

However, if you're using TILA as inspiration:
- ✅ Fork the repository
- ✅ Study the code architecture
- ✅ Adapt patterns for your use case

When the project reaches stability (v1.0), contribution guidelines will be added.

---

## 📄 License

TBD - License will be determined before stable release (v1.0).

Currently: All rights reserved.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://authjs.dev/) - Authentication
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📮 Support

- **Issues:** Report bugs via [GitHub Issues](https://github.com/ArziTech/tila/issues)
- **Discussions:** Use [GitHub Discussions](https://github.com/ArziTech/tila/discussions)

**Note:** As an alpha project, expect breaking changes and potential data loss until v1.0.

---

<div align="center">

**Made with ❤️ for lifelong learners**

[⬆ Back to Top](#tila---today-ive-learned-about)

</div>

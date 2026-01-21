# TILA - Today I've Learned About

**Version:** 0.2.0 (Alpha)
**Status:** Phase 1 - MVP (85-90% Complete)
**Development:** Solo Project
**License:** TBD

---

## Project Overview

### What is TILA?

TILA (Today I've Learned About) is a self-hosted, gamified personal learning management platform designed to help students and autodidacts track, organize, and celebrate their daily learning journey.

### Why TILA?

Most learning trackers focus on note-taking or task management. TILA is different:

- **Gamification-First**: Points, streaks, and levels transform learning from a chore into an engaging game
- **Daily Focus**: Built around tracking what you learned *today* to build consistent habits
- **Self-Hosted**: Complete control over your data, privacy-focused
- **Simple by Design**: One core purpose - track learning progress without feature bloat

### Who is it For?

- **Students**: Track coursework, projects, and skill development
- **Autodidacts**: Self-learners managing multiple topics and resources
- **Skill Builders**: Anyone building habits through consistent daily learning

### Core Philosophy

> **"Do one thing well"** - TILA focuses exclusively on personal learning tracking with gamification. No social feeds, no course marketplaces, no distractions. Just you, your learning journey, and the satisfaction of progress.

---

## Progress Tracker

### Phase 1: MVP Foundation

#### Authentication [5/6]
- [x] Email/password registration
- [x] Email/password login
- [x] Session management (NextAuth.js v5)
- [x] Password hashing with bcrypt
- [x] Route protection logic
- [ ] Google OAuth integration

#### Learning Tracker [6/6]
- [x] Create learning items
- [x] Read/list learning items
- [x] Update learning items
- [x] Delete learning items
- [x] Item detail view
- [x] Item filtering by category

#### Todo/Backlog System [7/7]
- [x] Create todos
- [x] Read/list todos
- [x] Update todos
- [x] Delete todos
- [x] 5-status workflow (Backlog, To Do, In Progress, Review, Done)
- [x] Todo filtering by status
- [x] Todo sorting (date, status)
- [x] Convert completed todos to learning items
- [x] Todo reordering

#### Organization [4/4]
- [x] Create categories
- [x] Update categories
- [x] Delete categories
- [x] Category color picker
- [x] Attach items to categories
- [x] Category filtering

#### Dashboard [6/6]
- [x] Statistics overview
- [x] Current streak display
- [x] Longest streak display
- [x] Total hours learned
- [x] Level progression
- [x] Recent activity feed
- [x] Quick action buttons

#### Profile [6/6]
- [x] Profile page
- [x] Edit name
- [x] Edit username
- [x] Edit email
- [x] Avatar selection (emoji-based)
- [x] Public/private profile toggle
- [x] Email verification

#### Gamification [8/8]
- [x] Points system (base + multipliers)
- [x] Difficulty multipliers (Beginner ×1, Intermediate ×1.5, Advanced ×2)
- [x] Streak tracking
- [x] Level calculation
- [x] Activity-based bonuses
- [x] User stats dashboard
- [ ] Achievement badges
- [ ] Certificate generation

#### Study Hours [1/3]
- [x] Duration field on items
- [x] Total hours calculation
- [ ] Detailed time logging
- [ ] Session tracking

**Phase 1 Progress: 48/52 tasks (92%)**

---

### Phase 2: Gamification & Management

#### Achievements System [0/8]
- [ ] Badge design system
- [ ] "Week Warrior" badge (7-day streak)
- [ ] "Month Master" badge (30-day streak)
- [ ] "Category Master" badge (10 items in one category)
- [ ] "Quick Learner" badge (5 items in one day)
- [ ] "Dedicated Student" badge (100 total items)
- [ ] "Polymath" badge (items in 5+ categories)
- [ ] Badge display on profile

#### Scheduling [0/5]
- [ ] Schedule creation interface
- [ ] Recurring schedule patterns
- [ ] Calendar view
- [ ] Due date reminders
- [ ] Email notifications

#### Social Features [0/4]
- [ ] Friend request system
- [ ] Friend list
- [ ] View friend profiles
- [ ] Compare progress with friends

#### Blogging/Articles [0/4]
- [ ] Article editor
- [ ] Attach articles to learning items
- [ ] Article listing
- [ ] Markdown support

#### Advanced Analytics [0/5]
- [ ] Learning patterns chart
- [ ] Category distribution visualization
- [ ] Streak history graph
- [ ] Activity heat map
- [ ] Export data (CSV/JSON)

**Phase 2 Progress: 0/26 tasks (0%)**

---

### Phase 3: AI & Advanced Features

#### AI Assistant (Tila Bot) [0/6]
- [ ] Daily topic recommendations
- [ ] Time management consultation
- [ ] Interactive quizzes
- [ ] Motivational messages
- [ ] Streak coaching
- [ ] Learning path generation

#### Smart Features [0/4]
- [ ] Auto-categorization suggestions
- [ ] Content summarization
- [ ] Related items recommendations
- [ ] Difficulty estimation

**Phase 3 Progress: 0/10 tasks (0%)**

---

## Gamification System

### Points Calculation

TILA uses a multi-factor points system to reward both learning activities and consistency.

#### Base Points Breakdown

| Activity | Base Points | Notes |
|----------|-------------|-------|
| Complete Learning Item | 100 | Main reward for documenting learning |
| Create Learning Item | 10 | Encourages tracking |
| Complete Todo | 25 | Rewards backlog management |
| Daily Login Streak | 5 per day | Consistency bonus |

#### Difficulty Multiplier

Completed learning items are multiplied based on difficulty:

```
Final Points = Base Points × Difficulty Multiplier

- Beginner:     ×1.0  (100 points)
- Intermediate: ×1.5  (150 points)
- Advanced:     ×2.0  (200 points)
```

**Example:** Completing an "Advanced" learning item earns 200 points instead of 100.

#### Streak System

- **Current Streak**: Consecutive days with learning activity
- **Longest Streak**: Personal best streak record
- **Streak Decay**: Missing a day resets current streak to 0

**Streak Maintenance Tips:**
- Even completing a single beginner item maintains your streak
- Creating items (without completing) does NOT maintain streak
- Consider a "quick win" item each day to protect streaks

#### Level Progression

Users level up based on total accumulated points:

```
Level = floor(total_points / 1000) + 1
```

- **Level 1**: 0-999 points
- **Level 2**: 1,000-1,999 points
- **Level 3**: 2,000-2,999 points
- And so on...

### Gamification Strategy

The points system is designed to encourage:

1. **Consistency**: Streak bonuses reward daily engagement
2. **Depth**: Higher difficulty items earn more points
3. **Completion**: Marking items "done" is the primary reward
4. **Progress**: Creating items gets minimal points; finishing them gets the reward

---

## Technical Architecture

### Tech Stack

**Frontend**
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with Shadcn/ui patterns
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query) for server state

**Backend**
- **Runtime**: Node.js
- **API**: Server Actions (mutations) + API Routes (queries)
- **Authentication**: NextAuth.js v5 (beta) with Credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **Adapter**: `@prisma/adapter-pg`

**Development**
- **Linting/Formatting**: Biome
- **Package Manager**: Bun
- **Version Control**: Git

### Project Structure

```
tila/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── actions/                # Server Actions (mutations)
│   ├── app/
│   │   ├── (auth)/            # Public routes (login, register)
│   │   ├── dashboard/         # Protected routes
│   │   └── api/               # API endpoints
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── learning/          # Learning-specific components
│   │   ├── items/             # Item management components
│   │   └── category/          # Category components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── schemas/           # Zod validation schemas
│   ├── auth.config.ts         # NextAuth configuration
│   └── routes.ts              # Route protection logic
├── .env                       # Environment variables (gitignored)
├── biome.json                 # Linting rules
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies
```

### Key Patterns

**1. Server Actions + TanStack Query**
- Server Actions handle all mutations (create, update, delete)
- TanStack Query manages server state caching and invalidation
- Provides type safety and optimal data fetching

**2. Route Protection**
- No middleware file
- Route protection handled at component level via `src/routes.ts`
- Session state determines route access

**3. Database Access**
- Prisma client singleton pattern in `src/lib/prisma.ts`
- Generated client outputs to `src/generated/prisma/`
- All database operations through typed Prisma queries

**4. Type Safety**
- Zod schemas for runtime validation
- `ActionResponse<T>` wrapper for Server Actions
- Strict TypeScript configuration

### Database Schema

**Models:**
- `User` - Authentication, profile, gamification stats
- `Account` - NextAuth.js account linking
- `Category` - Learning categories with colors
- `Item` - Learning items with difficulty and completion status
- `Todo` - Backlog items with workflow statuses

**Key User Fields:**
- `total_points` - Accumulated points
- `current_streak` / `longest_streak` - Streak tracking
- `learnings` - Total completed items count
- `uniqueCategories` - Category diversity metric
- `beginnerCount` / `intermediateCount` / `advancedCount` - Difficulty breakdown
- `emailVerified` - Email verification timestamp
- `verificationToken` - Secure token for email verification
- `verificationTokenExpires` - Token expiration (24 hours)

---

## Email Verification System

### Overview
TILA includes a secure email verification system to ensure users have valid email addresses. The system uses a token-based verification flow with Resend for email delivery.

### Architecture

**Database Schema** (`prisma/schema.prisma`):
```prisma
model User {
  // ... other fields
  emailVerified            DateTime?
  verificationToken        String?  @unique
  verificationTokenExpires DateTime?
}
```

**Key Components**:

1. **Email Service** (`src/lib/email.ts`)
   - Uses Resend API for production emails
   - Development mode: logs verification URL to console
   - Secure token generation with `crypto.randomBytes(32)`
   - 24-hour token expiration
   - Professional HTML email template

2. **Registration Flow** (`src/actions/auth/index.ts`)
   - Generates verification token on user registration
   - Stores token and expiration in database
   - Sends verification email immediately
   - Non-blocking: registration succeeds even if email fails

3. **Verification Actions** (`src/actions/verify-email.ts`)
   - `resendVerificationEmail()` - Server Action for resending emails
   - `verifyEmailToken()` - Validates token and updates user record
   - Follows `ActionResponse<T>` pattern for type safety

4. **API Endpoint** (`src/app/api/auth/verify-email/route.ts`)
   - GET endpoint: `/api/auth/verify-email?token={token}`
   - Validates token and checks expiration
   - Updates `emailVerified` field on success
   - Redirects to dashboard with success/error messages

5. **Banner Component** (`src/components/auth/EmailVerificationBanner.tsx`)
   - Client component with warning banner
   - Shows for unverified users on dashboard
   - "Resend verification email" button with loading state
   - Non-blocking: all features remain accessible

### User Flow

1. **Registration**:
   - User registers with email/password
   - Verification token generated and stored
   - Verification email sent immediately
   - User can log in and use all features (non-blocking)

2. **Email Verification**:
   - User clicks verification link from email
   - Token validated against database
   - Expiration checked (24 hours)
   - `emailVerified` field updated
   - Redirected to dashboard with success message

3. **Resend Email**:
   - Unverified users see banner on dashboard
   - Click "Resend verification email" button
   - New token generated and email sent
   - Success confirmation displayed

### Configuration

**Environment Variables** (`.env.example`):
```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxx

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

**Dependencies** (`package.json`):
```json
"resend": "^6.8.0"
```

### Development Mode

In development (`NODE_ENV=development`):
- Verification URL logged to console instead of sending email
- Format:
  ```
  === DEVELOPMENT MODE: Email Verification ===
  To: user@example.com
  Verification URL: http://localhost:3000/api/auth/verify-email?token=abc123...
  ===========================================
  ```
- No API call to Resend
- Faster testing iteration

### Security Features

1. **Token Generation**:
   - Uses `crypto.randomBytes(32)` for cryptographic security
   - 64-character hex string (32 bytes → 64 hex chars)
   - Unique constraint prevents collisions

2. **Token Expiration**:
   - 24-hour expiration from generation
   - Server-side validation
   - Single-use (cleared after verification)

3. **Error Handling**:
   - Generic error messages prevent information leakage
   - Detailed server-side logging for debugging
   - Graceful degradation (registration doesn't fail on email errors)

### Files Created/Modified

**Created**:
- `src/lib/email.ts` - Email sending utility
- `src/actions/verify-email.ts` - Verification Server Actions
- `src/app/api/auth/verify-email/route.ts` - Verification API endpoint
- `src/components/auth/EmailVerificationBanner.tsx` - Banner component

**Modified**:
- `prisma/schema.prisma` - Added verification fields
- `src/actions/auth/index.ts` - Updated registration flow
- `src/app/dashboard/layout.tsx` - Added banner component
- `.env.example` - Added RESEND_API_KEY
- `package.json` - Added resend dependency

### Testing

**Manual Testing**:
```bash
# 1. Start development server
bun run dev

# 2. Register new user
# Check console for verification URL (development mode)

# 3. Click verification link
# Should redirect to dashboard with success message

# 4. Test resend button
# Click "Resend email" in banner
# Check for new link in console
```

**Database Verification**:
```sql
-- Check user verification status
SELECT email, "emailVerified", "verificationTokenExpires"
FROM "User"
WHERE email = 'test@example.com';

-- View all unverified users
SELECT email, "verificationTokenExpires"
FROM "User"
WHERE "emailVerified" IS NULL;
```

### Deployment Checklist

Before deploying to production:
- [ ] Set `RESEND_API_KEY` in production environment
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Ensure `NODE_ENV=production`
- [ ] Test email sending with production Resend API key
- [ ] Verify database schema is up to date
- [ ] Monitor Resend API quota and limits
- [ ] Set up logging for email delivery failures

---

## Roadmap

### Phase 1: MVP (Current Phase) - 90% Complete

**Goal:** Establish core learning tracking with basic gamification

**Completed:**
- ✅ Authentication (Email/Password)
- ✅ Learning Items CRUD
- ✅ Categories with colors
- ✅ Todos with 5-status workflow
- ✅ Dashboard with stats
- ✅ Profile management
- ✅ Points & streaks system
- ✅ Level progression

**Remaining:**
- ⏳ Certificates generation
- ⏳ Study hours detailed tracking
- ⏳ Google OAuth integration

**Target Completion:** Q1 2026

---

### Phase 2: Gamification & Management

**Goal:** Deepen engagement through rewards and social accountability

**Planned Features:**
- **Enhanced Achievements**: 20+ badges for milestones (e.g., "Week Warrior", "Category Master")
- **Scheduling System**: Create recurring learning schedules with reminders
- **Limited Social Features**: Friend requests, progress viewing (no feeds or comments)
- **Internal Blogging**: Write articles/summaries attached to learning items
- **Advanced Analytics**: Learning patterns, category distribution, streak analysis
- **Notification System**: Email/push reminders for schedules and streak warnings

**Target Start:** Q2 2026
**Target Completion:** Q3 2026

---

### Phase 3: AI & Advanced Features

**Goal:** Personalized learning assistance and intelligent recommendations

**Planned Features:**
- **Tila Bot (AI Assistant)**:
  - Daily learning topic recommendations
  - Time management consultation
  - Interactive quizzes on completed items
  - Motivational messages and streak coaching
- **Smart Suggestions**: Recommend items based on learning history
- **Auto-Categorization**: AI-suggested categories for new items
- **Learning Paths**: Generate skill roadmaps based on goals
- **Content Summarization**: AI-powered summaries of long-form resources

**Note:** AI provider to be determined (OpenAI, Anthropic, or local models)

**Target Start:** Q4 2026 (Aspirational)

---

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Bun

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tila
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

   Required environment variables:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/tila?schema=public"
   NEXTAUTH_SECRET="your-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Start PostgreSQL (Docker)**
   ```bash
   docker-compose -f docker-compose.dev.yaml up -d
   ```

5. **Initialize database**
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

6. **Start development server**
   ```bash
   bun run dev
   ```

   Visit `http://localhost:3000`

### Development Commands

```bash
# Development
bun run dev              # Start dev server

# Building
bun run build            # Production build
bun run start            # Start production server

# Database
bunx prisma studio        # Open database GUI
bunx prisma generate      # Regenerate Prisma client
bunx prisma db push       # Push schema changes (dev only)
bunx prisma migrate dev   # Create migration (production)

# Code Quality
bun run lint             # Lint with Biome
bun run format           # Format with Biome
```

### Development Notes

**Testing Mode:**
- In development, plain text passwords are accepted (bypasses bcrypt)
- See `src/auth.config.ts:46-51` for bypass logic
- **Never deploy with development mode enabled**

**Schema Changes:**
- Always regenerate Prisma client after schema changes: `bunx prisma generate`
- Use `bunx prisma db push` for rapid prototyping
- Use `bunx prisma migrate dev` for production-worthy migrations

**React Compiler:**
- Enabled in `next.config.ts`
- Optimizes React components automatically
- May affect component behavior in edge cases

---

## Deployment Strategy

### Deployment Options

**Option 1: Vercel (Recommended for ease)**

1. Push code to GitHub repository
2. Import project to Vercel
3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL` (use managed PostgreSQL like Supabase, Neon, or Railway)
   - `NEXTAUTH_SECRET` (generate random string)
4. Deploy automatically on push to main branch

**Option 2: Self-Hosted Docker**

1. Build production image:
   ```bash
   docker build -t tila .
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose -f docker-compose.prod.yaml up -d
   ```

3. Configure reverse proxy (nginx/traefik) for SSL

**Option 3: VPS (Traditional)**

1. Set up VPS with Ubuntu 20.04+
2. Install Node.js 20+, Bun, and PostgreSQL 14+
3. Clone repository and install dependencies
4. Configure PM2 for process management:
   ```bash
   bun install -g pm2
   pm2 start bun --name "tila" -- run start
   pm2 save
   pm2 startup
   ```

### Database Hosting

**Managed Services:**
- Supabase (Free tier available)
- Neon (Serverless PostgreSQL)
- Railway (Simple PostgreSQL)
- AWS RDS (Production-grade)

**Self-Hosted:**
- Docker PostgreSQL container
- Requires regular backups and maintenance

### Environment Variables Checklist

**Required for Production:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random 32+ character string
- `NEXTAUTH_URL` - Production URL (e.g., `https://tila.example.com`)

**Optional (for Phase 1):**
- `GOOGLE_CLIENT_ID` - For Google OAuth (when implemented)
- `GOOGLE_CLIENT_SECRET` - For Google OAuth

### Backup Strategy

**Database Backups:**
```bash
# Manual backup
pg_dump $DATABASE_URL > tila-backup-$(date +%Y%m%d).sql

# Automated with cron (daily at 2 AM)
0 2 * * * /usr/bin/pg_dump $DATABASE_URL > /backups/tila-$(date +\%Y\%m\%d).sql
```

**Recommendation:** Use managed PostgreSQL with automated backups for production.

---

## Known Limitations

### Current Limitations

1. **No Google OAuth yet** - Email/password only
2. **No certificate generation** - Planned for Phase 1 completion
3. **No time tracking** - Study hours tracked in schema but not implemented
4. **Development mode bypass** - Plain text passwords work in dev (intentional)

### Technical Debt

1. **No test suite** - Testing framework not yet established
2. **No monitoring/logging** - No error tracking (Sentry) or analytics
3. **No API rate limiting** - Potential abuse vector if exposed publicly

### Future Improvements

1. **Testing**: Add unit and integration tests
2. **Monitoring**: Implement error tracking and performance monitoring
3. **Accessibility**: Full WCAG AA compliance audit
4. **i18n**: Multi-language support (currently English only)
5. **PWA**: Offline capabilities and mobile app

---

## Version History

### 0.2.0 (Current) - Alpha
- Enhanced todo system with 5-status workflow
- Improved dashboard statistics
- Refactored card components
- Docker Compose for local development
- Email verification system with Resend integration
- Non-blocking verification flow (users can access features while unverified)

### 0.1.0 - Initial MVP
- Basic authentication
- Learning items CRUD
- Categories
- Simple gamification (points, streaks)
- Profile management

---

## Contributing

**Note:** This is currently a solo project. External contributions are not accepted at this time.

However, if you're using TILA as inspiration for your own project, feel free to:

- Fork the repository
- Study the code architecture
- Adapt patterns for your use case

**Future:** When the project reaches stability (v1.0), contribution guidelines will be added.

---

## Support & Feedback

**Issues:** Report bugs via GitHub Issues
**Discussions:** Use GitHub Discussions for questions
**Roadmap:** Track progress via GitHub Projects

**Note:** As an alpha project, expect breaking changes and potential data loss until v1.0.

---

## License

TBD - License will be determined before stable release (v1.0).

Currently: All rights reserved.

---

## Acknowledgments

- **Next.js** - React framework
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication solution
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework

---

**Last Updated:** 2026-01-21
**Document Version:** 1.0
**Maintainer:** Project Lead

# LeetCode SaaS — Project Overview

> A visual LeetCode analytics and interview preparation platform. Sync LeetCode activity, organize solved problems by patterns, track progress, and build a deeper understanding of DSA concepts.

---

## Vision

This project starts as a lightweight personal dashboard for syncing and visualizing LeetCode progress.

Long term, the platform aims to become a complete interview preparation system that helps software engineers:

- Understand problem-solving patterns
- Learn multiple approaches for the same problem
- Track strengths and weaknesses
- Visualize progress over time
- Build structured interview preparation workflows

The first version focuses only on syncing LeetCode data and displaying problems in a clean, useful, visual dashboard.

---

## Initial Goal (MVP)

### Step 1

User registers and connects their LeetCode username.

The system:

1. Syncs solved problems from LeetCode GraphQL APIs
2. Stores all solved problems locally
3. Categorizes problems by:
   - Difficulty
   - Tags
   - Patterns
4. Displays them visually in a dashboard
5. Supports incremental sync for new solved problems

---

## Problem

LeetCode itself provides limited visualization and organization for interview preparation.

Users often struggle to:

- Track which patterns they are strong/weak in
- Understand progress visually
- Group problems by interview concepts
- Revisit important problems
- Build structured learning paths
- Analyze submission history effectively

This platform solves that by turning raw LeetCode activity into a structured interview-prep dashboard.

---

## Target Users

| Persona | Core Need |
|---|---|
| Interview Candidate | Track preparation progress |
| SDE preparing for FAANG | Understand DSA pattern coverage |
| Consistent LeetCode User | Analyze solved problem history |
| Advanced Learner | Explore multiple approaches per problem |
| Future Paid Users | Structured interview preparation analytics |

---

## Core Features (Phase 1)

### A. User Authentication

Users can:

- Register/login
- Add their LeetCode username
- Trigger manual sync

Authentication uses:

- Email/password
- GitHub OAuth

---

### B. LeetCode Sync Engine

The sync system fetches user data from:

- `leetcode.com/graphql`

Initial sync:

- Fetch all solved problems
- Fetch recent submissions
- Store locally in PostgreSQL

Incremental sync:

- Only fetch newly solved problems
- Update latest submissions
- Avoid duplicate inserts

---

### C. Problem Dashboard

Dashboard displays:

- Total solved count
- Difficulty breakdown
- Problems grouped by pattern
- Recently solved problems
- Submission activity

Each problem card may show:

- LeetCode ID
- Title
- Difficulty
- Acceptance rate
- Tags
- Pattern/category
- Last solved time

---

### D. Pattern-Based Organization

Problems will be categorized into patterns such as:

- Array
- HashMap
- Sliding Window
- Two Pointer
- Binary Search
- Graph
- Tree
- DP
- Greedy
- Trie
- Union Find
- Backtracking
- Segment Tree
- Topological Sort
- Shortest Path

Future versions may support:

- Multiple patterns per problem
- Primary vs secondary patterns
- Pattern mastery tracking

---

### E. Submission Tracking

Store submission metadata:

- Status
- Language
- Runtime
- Memory
- Timestamp

Future support:

- Full submission history
- Submission analytics
- Daily streak visualization

---

## Future Vision

The long-term vision is much bigger than analytics.

Potential future features:

### AI-Assisted Learning

- Explain solutions
- Generate optimized approaches
- Compare multiple patterns
- Identify weak areas
- Personalized practice recommendations

### Pattern Learning System

For each problem:

- Multiple solution patterns
- Python explanations
- Visualization
- Related problems
- Complexity analysis

### Interview Preparation System

- Company-wise preparation
- Study plans
- Blind 75 tracking
- Mock interview workflows
- Progress scoring

### Knowledge Graph

Map relationships between:

- Problems
- Patterns
- Concepts
- Companies
- Difficulty progression

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 / React 19 (SSR + API routes, single repo) |
| **Language** | TypeScript |
| **Database** | Neon (cloud PostgreSQL) |
| **ORM** | Prisma 7 (latest) |
| **Auth** | NextAuth v5 (email/password + GitHub OAuth) |
| **File Storage** | Cloudflare R2 |
| **AI** | OpenAI `gpt-5-nano` |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Caching** | Redis (TBD) |

---

## Architecture Overview

```txt
┌────────────────────────────────────────────┐
│                CLIENT APP                  │
│                                            │
│  Dashboard                                 │
│  Problem Explorer                          │
│  Pattern Analytics                         │
│  Sync Settings                             │
└──────────────────┬─────────────────────────┘
                   │
             Next.js API Routes
                   │
      ┌────────────┼────────────┐
      │                         │
┌─────▼─────┐          ┌────────▼────────┐
│ PostgreSQL│          │ LeetCode GraphQL │
│   Prisma  │          │     APIs         │
└───────────┘          └──────────────────┘
```

---

## Data Model

### User

Stores application users.

```prisma
model User {
  id                String   @id @default(cuid())
  name              String?
  email             String?  @unique
  leetcodeUsername  String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  problems          UserProblem[]
  submissions       Submission[]
}
```

---

### Problem

Stores LeetCode problems with direct link generation.

```prisma
model Problem {
  id              String     @id @default(cuid())
  questionId      Int        @unique           // LeetCode problem number
  title           String
  titleSlug       String     @unique           // Used to generate LeetCode URL
  difficulty      Difficulty
  acceptanceRate  Float?
  isPaidOnly      Boolean    @default(false)
  topics          String[]                     // LeetCode tags ["Array", "Hash Table"]

  patterns        ProblemPattern[]
  solvedByUsers   UserProblem[]
  submissions     Submission[]

  @@index([difficulty])
  @@index([isPaidOnly])
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

**LeetCode URL Construction:**
```typescript
// Helper function to generate LeetCode link
function getLeetCodeUrl(problem: Problem): string {
  return `https://leetcode.com/problems/${problem.titleSlug}/`;
}

// Example: titleSlug = "two-sum"
// URL: https://leetcode.com/problems/two-sum/

---

### UserProblem

Tracks solved problems per user.

```prisma
model UserProblem {
  userId       String
  problemId    String
  firstSolvedAt DateTime?
  lastSolvedAt  DateTime?

  user         User    @relation(fields: [userId], references: [id])
  problem      Problem @relation(fields: [problemId], references: [id])

  @@id([userId, problemId])
}
```

---

### Pattern

```prisma
model Pattern {
  id        String @id @default(cuid())
  name      String @unique

  problems  ProblemPattern[]
}
```

---

### ProblemPattern

```prisma
model ProblemPattern {
  problemId String
  patternId String

  problem   Problem @relation(fields: [problemId], references: [id])
  pattern   Pattern @relation(fields: [patternId], references: [id])

  @@id([problemId, patternId])
}
```

---

### Submission

```prisma
model Submission {
  id          String   @id @default(cuid())

  userId      String
  problemId   String

  status      String
  language    String?
  runtime     String?
  memory      String?

  submittedAt DateTime

  user         User    @relation(fields: [userId], references: [id])
  problem      Problem @relation(fields: [problemId], references: [id])
}
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | Main analytics dashboard |
| `/problems` | All solved problems |
| `/patterns` | Pattern-wise grouping |
| `/patterns/:id` | Single pattern page |
| `/submissions` | Submission history |
| `/settings` | Sync settings + LeetCode username |

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/sync` | Trigger LeetCode sync |
| `GET` | `/api/problems` | List problems |
| `GET` | `/api/problems/:id` | Single problem |
| `GET` | `/api/patterns` | List patterns |
| `GET` | `/api/dashboard` | Dashboard analytics |
| `GET` | `/api/submissions` | User submissions |

---

## Sync Strategy

### Initial Sync

- Fetch all solved problems
- Store locally
- Fetch recent submissions
- Create relationships between:
  - user
  - problems
  - patterns

### Incremental Sync

On future syncs:

- Only insert new solved problems
- Update submission history
- Avoid duplicates

Possible approaches:

- Compare latest accepted submission timestamps
- Maintain sync checkpoints
- Use upsert operations

---

## UI / UX

### Design Goals

- Fast
- Minimal
- Developer-focused
- Visual analytics
- Dark mode first

### Dashboard Ideas

- Heatmaps
- Difficulty charts
- Pattern distribution
- Progress bars
- Streak tracking
- Recently solved timeline

Design inspiration:

- Linear
- GitHub contribution graphs
- LeetCode
- Notion analytics dashboards

---

## Development Notes

- Use Prisma migrations only
- Never use `db push`
- Initial focus is functionality over monetization
- AI features come later
- Prioritize clean sync architecture
- Store enough metadata for future analytics expansion

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

OPENAI_API_KEY="..."

LEETCODE_BASE_URL="https://leetcode.com/graphql"
```

---

## Future Monetization Ideas

Potential future premium features:

- AI-generated explanations
- Pattern mastery scoring
- Company-specific prep
- Personalized study plans
- Advanced analytics
- Mock interview systems
- Resume/interview readiness score

Not part of MVP.

---

## Important Notes for Claude Code

### Priorities

1. Build stable sync system first
2. Ensure incremental sync works correctly
3. Keep schema extensible
4. Design for future AI integration
5. Avoid overengineering MVP

### Coding Preferences

- Clean architecture
- Strong typing
- Reusable services
- Server-side data fetching where useful
- Avoid unnecessary abstractions early

### MVP Focus

The MVP is NOT an AI platform yet.

The MVP is:

- LeetCode sync
- Problem storage
- Pattern organization
- Visual dashboard
- Incremental updates

Everything else comes later.
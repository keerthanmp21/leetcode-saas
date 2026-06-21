# LeetCode GraphQL API — Full Documentation

All queries tested live against `https://leetcode.com/graphql` on 2026-05-18.

---

## Connection

| Property | Value |
|---|---|
| Endpoint | `https://leetcode.com/graphql` |
| Method | `POST` |
| Content-Type | `application/json` |
| Body | `{ "query": "<graphql query>" }` |

### Required headers (all requests)

```
Content-Type: application/json
User-Agent: Mozilla/5.0
Referer: https://leetcode.com
```

### Additional headers (authenticated requests only)

```
Cookie: LEETCODE_SESSION=<token>
x-csrftoken: csrftoken
```

`LEETCODE_SESSION` is extracted from your browser cookies after logging in. It expires periodically.

---

## Auth requirements

| Query | Auth required |
|---|---|
| `recentAcSubmissionList` | No (capped at 20) |
| `question` | No |
| `matchedUser` | No |
| `allQuestionsCount` | No |
| `userContestRanking` | No |
| `userContestRankingHistory` | No |
| `problemsetQuestionListV2` | No |
| `solvedQuestionsInfo` | **Yes** |

---

## Query 1 — `recentAcSubmissionList`

Returns the most recent accepted submissions for a user. Public, no session required.  
Maximum `limit` is **20** without a session.

### Request

```graphql
{
  recentAcSubmissionList(username: "keerthan-mp", limit: 5) {
    id
    title
    titleSlug
    timestamp
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `username` | String | Yes | LeetCode username |
| `limit` | Int | Yes | Number of submissions to return (max 20 public) |

### Response fields

| Field | Type | Description |
|---|---|---|
| `id` | String | Unique submission ID |
| `title` | String | Problem title |
| `titleSlug` | String | URL slug (e.g. `"two-sum"`) |
| `timestamp` | String | Unix timestamp in **seconds** — multiply by 1000 for ms |

### Example response

```json
[
  {
    "id": "1982476568",
    "title": "Decode String",
    "titleSlug": "decode-string",
    "timestamp": "1776586424"
  }
]
```

---

## Query 2 — `question`

Returns full details for a single problem. Public, no session required.

### Request

```graphql
{
  question(titleSlug: "two-sum") {
    questionId
    questionFrontendId
    title
    titleSlug
    difficulty
    isPaidOnly
    status
    content
    hints
    acRate
    likes
    dislikes
    stats
    similarQuestions
    topicTags {
      name
      slug
    }
    codeSnippets {
      lang
      langSlug
      code
    }
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `titleSlug` | String | Yes | Problem slug (from the URL, e.g. `"two-sum"`) |

### Response fields

| Field | Type | Description |
|---|---|---|
| `questionId` | String | Internal numeric ID |
| `questionFrontendId` | String | Display number shown on LeetCode (e.g. `"1"`) |
| `title` | String | Problem title |
| `titleSlug` | String | URL slug |
| `difficulty` | String | `"Easy"`, `"Medium"`, or `"Hard"` |
| `isPaidOnly` | Boolean | `true` if problem requires a premium subscription |
| `status` | String \| null | User's status for the problem (null without session) |
| `content` | String | Full problem statement as HTML |
| `hints` | String[] | Array of hint strings |
| `acRate` | Float | Acceptance rate as a decimal (e.g. `0.575` = 57.5%) |
| `likes` | Int | Total upvotes |
| `dislikes` | Int | Total downvotes |
| `stats` | String | JSON string with `totalAccepted`, `totalSubmission`, `totalAcceptedRaw`, `totalSubmissionRaw`, `acRate` |
| `similarQuestions` | String | JSON array of `{ title, titleSlug, difficulty, translatedTitle }` |
| `topicTags` | Array | See below |
| `codeSnippets` | Array | See below |

**`topicTags` item:**

| Field | Type | Description |
|---|---|---|
| `name` | String | Tag display name (e.g. `"Dynamic Programming"`) |
| `slug` | String | Tag slug (e.g. `"dynamic-programming"`) |

**`codeSnippets` item:**

| Field | Type | Description |
|---|---|---|
| `lang` | String | Language name (e.g. `"Python3"`, `"Java"`, `"C++"`) |
| `langSlug` | String | Language identifier (e.g. `"python3"`, `"java"`, `"cpp"`) |
| `code` | String | Starter code template |

Available languages include: C++, Java, Python3, Python, JavaScript, TypeScript, C#, C, Go, Kotlin, Swift, Rust, PHP, Scala, Ruby, Dart, Erlang, Elixir, Racket.

### Example response

```json
{
  "questionId": "1",
  "questionFrontendId": "1",
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "Easy",
  "isPaidOnly": false,
  "status": null,
  "acRate": 57.48,
  "likes": 68876,
  "dislikes": 2574,
  "stats": "{\"totalAccepted\": \"21.8M\", \"totalSubmission\": \"37.9M\", \"totalAcceptedRaw\": 21764337, \"totalSubmissionRaw\": 37861495, \"acRate\": \"57.5%\"}",
  "topicTags": [
    { "name": "Array", "slug": "array" },
    { "name": "Hash Table", "slug": "hash-table" }
  ],
  "codeSnippets": [
    { "lang": "Python3", "langSlug": "python3", "code": "class Solution:\n    def twoSum(...)" }
  ]
}
```

---

## Query 3 — `matchedUser`

Returns comprehensive public profile data for a user.

### 3a — Profile & social links

```graphql
{
  matchedUser(username: "keerthan-mp") {
    username
    githubUrl
    twitterUrl
    linkedinUrl
    profile {
      ranking
      userAvatar
      realName
      aboutMe
      school
      company
      location
      skillTags
      websites
      starRating
    }
  }
}
```

**Response fields:**

| Field | Type | Description |
|---|---|---|
| `username` | String | LeetCode username |
| `githubUrl` | String \| null | GitHub profile URL |
| `twitterUrl` | String \| null | Twitter/X profile URL |
| `linkedinUrl` | String | LinkedIn URL |
| `profile.ranking` | Int | Global ranking on LeetCode |
| `profile.userAvatar` | String | URL of the user's avatar image |
| `profile.realName` | String | User's real name |
| `profile.aboutMe` | String | Bio text |
| `profile.school` | String \| null | School / university |
| `profile.company` | String \| null | Current company |
| `profile.location` | String | Location string (URL-encoded, e.g. `"India%Karnataka%Bengaluru"`) |
| `profile.skillTags` | String[] | Self-reported skill tags (e.g. `["python", "java"]`) |
| `profile.websites` | String[] | Personal website URLs |
| `profile.starRating` | Float | Star rating (e.g. `2.5`) |

### 3b — Submission statistics

```graphql
{
  matchedUser(username: "keerthan-mp") {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
}
```

**Response fields (per item in both arrays):**

| Field | Type | Description |
|---|---|---|
| `difficulty` | String | `"All"`, `"Easy"`, `"Medium"`, or `"Hard"` |
| `count` | Int | Number of **distinct problems** solved/attempted |
| `submissions` | Int | Total number of submissions made |

`acSubmissionNum` = accepted only. `totalSubmissionNum` = all attempts.

### Example response

```json
{
  "acSubmissionNum": [
    { "difficulty": "All",    "count": 475, "submissions": 1545 },
    { "difficulty": "Easy",   "count": 150, "submissions": 426  },
    { "difficulty": "Medium", "count": 272, "submissions": 973  },
    { "difficulty": "Hard",   "count": 53,  "submissions": 146  }
  ],
  "totalSubmissionNum": [
    { "difficulty": "All",    "count": 486, "submissions": 2188 },
    { "difficulty": "Easy",   "count": 150, "submissions": 586  },
    { "difficulty": "Medium", "count": 278, "submissions": 1372 },
    { "difficulty": "Hard",   "count": 58,  "submissions": 230  }
  ]
}
```

### 3c — Problems solved beats stats

```graphql
{
  matchedUser(username: "keerthan-mp") {
    problemsSolvedBeatsStats {
      difficulty
      percentage
    }
  }
}
```

Shows the percentage of users the queried user outperforms for problems solved in each difficulty.

| Field | Type | Description |
|---|---|---|
| `difficulty` | String | `"Easy"`, `"Medium"`, `"Hard"` |
| `percentage` | Float | Percentile (e.g. `95.14` = beats 95.14% of users) |

### Example response

```json
[
  { "difficulty": "Easy",   "percentage": 95.14 },
  { "difficulty": "Medium", "percentage": 96.26 },
  { "difficulty": "Hard",   "percentage": 92.24 }
]
```

### 3d — Language breakdown

```graphql
{
  matchedUser(username: "keerthan-mp") {
    languageProblemCount {
      languageName
      problemsSolved
    }
  }
}
```

| Field | Type | Description |
|---|---|---|
| `languageName` | String | Language name (e.g. `"Python3"`, `"Java"`) |
| `problemsSolved` | Int | Number of distinct problems solved in that language |

### Example response

```json
[
  { "languageName": "Python3",    "problemsSolved": 445 },
  { "languageName": "Java",       "problemsSolved": 115 },
  { "languageName": "JavaScript", "problemsSolved": 30  }
]
```

### 3e — Tag/topic breakdown

```graphql
{
  matchedUser(username: "keerthan-mp") {
    tagProblemCounts {
      advanced {
        tagName
        tagSlug
        problemsSolved
      }
      intermediate {
        tagName
        tagSlug
        problemsSolved
      }
      fundamental {
        tagName
        tagSlug
        problemsSolved
      }
    }
  }
}
```

Returns solved count grouped by topic tag, split into three tiers.

| Field | Type | Description |
|---|---|---|
| `tagName` | String | Human-readable tag name (e.g. `"Dynamic Programming"`) |
| `tagSlug` | String | URL slug (e.g. `"dynamic-programming"`) |
| `problemsSolved` | Int | Problems solved with this tag |

**Tier definitions:**

| Tier | Example tags |
|---|---|
| `fundamental` | Array, String, Stack, Linked List, Two Pointers, Sorting, Simulation |
| `intermediate` | Tree, Hash Table, Graph, BFS, DFS, Binary Search, Greedy, Math, Design |
| `advanced` | Dynamic Programming, Backtracking, Trie, Segment Tree, Monotonic Stack, Union-Find |

### 3f — Submission calendar (heatmap)

```graphql
{
  matchedUser(username: "keerthan-mp") {
    userCalendar(year: 2026) {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
      dccBadges {
        timestamp
        badge {
          name
          icon
        }
      }
    }
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `year` | Int | No | Calendar year to retrieve (defaults to current year) |

### Response fields

| Field | Type | Description |
|---|---|---|
| `activeYears` | Int[] | All years the user has made submissions |
| `streak` | Int | Current consecutive day submission streak |
| `totalActiveDays` | Int | Total days with at least one submission (in the requested year) |
| `submissionCalendar` | String | JSON string mapping Unix timestamp (start of day, seconds) → submission count |
| `dccBadges` | Array | Daily Challenge badges earned. Each has `timestamp` (Unix) and `badge { name, icon }` |

### Example `submissionCalendar` (parsed)

```json
{
  "1775520000": 6,
  "1775606400": 3,
  "1775692800": 1
}
```

Keys are Unix timestamps (seconds) for the start of each day in UTC.

### 3g — Badges

```graphql
{
  matchedUser(username: "keerthan-mp") {
    badges {
      id
      name
      shortName
      displayName
      icon
      hoverText
      creationDate
      category
      medal {
        slug
        config {
          iconGif
          iconGifBackground
        }
      }
    }
    upcomingBadges {
      name
      icon
      progress
    }
    activeBadge {
      id
      name
      displayName
      icon
      creationDate
      category
    }
  }
}
```

**`badges` item fields:**

| Field | Type | Description |
|---|---|---|
| `id` | String | Badge ID |
| `name` | String | Badge category name (e.g. `"Annual Badge"`) |
| `shortName` | String | Short display name (e.g. `"50 Days Badge 2025"`) |
| `displayName` | String | Full display name |
| `icon` | String | URL to the badge icon image |
| `hoverText` | String | Tooltip text |
| `creationDate` | String | Date earned (`"YYYY-MM-DD"`) |
| `category` | String | `"ANNUAL"`, `"SUBMISSION"`, etc. |
| `medal.slug` | String | Medal identifier slug |
| `medal.config.iconGif` | String | URL to animated GIF version |
| `medal.config.iconGifBackground` | String | URL to background image for the GIF |

**`upcomingBadges` item fields:**

| Field | Type | Description |
|---|---|---|
| `name` | String | Badge name (e.g. `"May LeetCoding Challenge"`) |
| `icon` | String | Relative path to icon |
| `progress` | Int | Current progress toward earning the badge (0–100) |

**`activeBadge`:** Same shape as a `badges` item — the badge the user has set as their profile badge.

---

## Query 4 — `allQuestionsCount`

Returns total problem counts on LeetCode by difficulty. No parameters required.

### Request

```graphql
{
  allQuestionsCount {
    difficulty
    count
  }
}
```

### Response fields

| Field | Type | Description |
|---|---|---|
| `difficulty` | String | `"All"`, `"Easy"`, `"Medium"`, `"Hard"` |
| `count` | Int | Total number of problems at that difficulty |

### Example response

```json
[
  { "difficulty": "All",    "count": 3934 },
  { "difficulty": "Easy",   "count": 944  },
  { "difficulty": "Medium", "count": 2056 },
  { "difficulty": "Hard",   "count": 934  }
]
```

---

## Query 5 — `userContestRanking`

Returns contest rating and ranking summary for a user.

### Request

```graphql
{
  userContestRanking(username: "keerthan-mp") {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `username` | String | Yes | LeetCode username |

### Response fields

| Field | Type | Description |
|---|---|---|
| `attendedContestsCount` | Int | Number of contests participated in |
| `rating` | Float | Current contest rating (ELO-style, starts at ~1500) |
| `globalRanking` | Int | Global contest ranking position |
| `totalParticipants` | Int | Total number of users with a contest rating |
| `topPercentage` | Float | Percentile (e.g. `42.05` = top 42%) |
| `badge` | Object \| null | Contest tier badge if earned (e.g. `{ "name": "Knight" }`). null if none |

### Example response

```json
{
  "attendedContestsCount": 2,
  "rating": 1507.342,
  "globalRanking": 363700,
  "totalParticipants": 874349,
  "topPercentage": 42.05,
  "badge": null
}
```

---

## Query 6 — `userContestRankingHistory`

Returns per-contest performance history for a user.

### Request

```graphql
{
  userContestRankingHistory(username: "keerthan-mp") {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `username` | String | Yes | LeetCode username |

### Response fields (per item)

| Field | Type | Description |
|---|---|---|
| `attended` | Boolean | Whether the user actually participated |
| `trendDirection` | String | `"UP"`, `"DOWN"`, or `"NONE"` — rating change direction |
| `problemsSolved` | Int | Number of problems solved in that contest |
| `totalProblems` | Int | Total problems available in the contest |
| `finishTimeInSeconds` | Int | Time taken to finish (from contest start) |
| `rating` | Float | Rating **after** this contest |
| `ranking` | Int | Rank achieved in this contest |
| `contest.title` | String | Contest name (e.g. `"Weekly Contest 366"`) |
| `contest.startTime` | Int | Unix timestamp (seconds) of contest start |

### Example response

```json
[
  {
    "attended": true,
    "trendDirection": "UP",
    "problemsSolved": 2,
    "totalProblems": 4,
    "finishTimeInSeconds": 2415,
    "rating": 1507.342,
    "ranking": 10462,
    "contest": {
      "title": "Weekly Contest 366",
      "startTime": 1696732200
    }
  }
]
```

---

## Query 7 — `problemsetQuestionListV2`

Browse the full problem set with filtering and pagination.

### Request

```graphql
{
  problemsetQuestionListV2(
    categorySlug: ""
    limit: 50
    skip: 0
    filters: { filterCombineType: ALL }
  ) {
    questions {
      id
      questionFrontendId
      title
      titleSlug
      difficulty
      paidOnly
      acRate
      status
      topicTags {
        name
        slug
      }
    }
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `categorySlug` | String | Yes | Category to restrict to. Pass `""` for all. Known values: `"algorithms"`, `"database"`, `"shell"`, `"concurrency"` |
| `limit` | Int | Yes | Number of results per page |
| `skip` | Int | Yes | Offset for pagination |
| `filters` | Object | Yes | Filter configuration — see below |

### `filters` object

`filterCombineType` is required. All other filter fields are optional.

| Field | Type | Description |
|---|---|---|
| `filterCombineType` | Enum | **Required.** `ALL` (AND logic) or `ANY` (OR logic) |
| `difficultyFilter` | Object | `{ difficulties: [EASY \| MEDIUM \| HARD], operator?: IN \| NOT_IN }` |
| `topicFilter` | Object | `{ topicSlugs: ["dynamic-programming", ...], operator?: IN \| NOT_IN }` |
| `statusFilter` | Object | Filter by solve status |
| `premiumFilter` | Object | Filter by premium/free status |
| `acceptanceFilter` | Object | Filter by acceptance rate range |
| `frontendIdFilter` | Object | Filter by question number range |

### Filter examples

**By difficulty:**
```graphql
filters: {
  filterCombineType: ALL
  difficultyFilter: { difficulties: [EASY] }
}
```

**By topic tag:**
```graphql
filters: {
  filterCombineType: ALL
  topicFilter: { topicSlugs: ["dynamic-programming", "array"] }
}
```

### Response fields (per question)

| Field | Type | Description |
|---|---|---|
| `id` | Int | Internal numeric ID |
| `questionFrontendId` | String | Display number (e.g. `"1"`) |
| `title` | String | Problem title |
| `titleSlug` | String | URL slug |
| `difficulty` | String | `"EASY"`, `"MEDIUM"`, or `"HARD"` (uppercase — different from `question` query) |
| `paidOnly` | Boolean | Whether premium is required |
| `acRate` | Float | Acceptance rate as a decimal (e.g. `0.5748`) |
| `status` | String | `"TO_DO"`, `"SOLVED"`, `"ATTEMPTED"` |
| `topicTags` | Array | `{ name, slug }` per tag |
| `frequency` | Float \| null | Premium field — frequency score |
| `isInMyFavorites` | Boolean | Whether saved to favourites (requires session) |
| `contestPoint` | Int \| null | Points awarded in contest context |

### Notes
- `difficulty` returns uppercase here (`"EASY"`) unlike `question(titleSlug)` which returns title-case (`"Easy"`).
- `acRate` here is a raw decimal; the `question` query returns the same as a percentage float.

---

## Query 8 — `solvedQuestionsInfo` *(requires session)*

Returns a paginated list of all problems the authenticated user has solved.

### Request

```graphql
{
  solvedQuestionsInfo(filters: {}, pageNo: 1, numPerPage: 50) {
    totalNum
    pageNum
    data {
      totalSolves
      question {
        title
        titleSlug
        questionFrontendId
        difficulty
        topicTags {
          name
          slug
        }
      }
      lastAcSession {
        time
      }
    }
  }
}
```

### Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| `filters` | Object | Yes | Pass `{}` for no filters |
| `pageNo` | Int | Yes | 1-based page number |
| `numPerPage` | Int | Yes | Items per page (50 recommended) |

### Response fields

| Field | Type | Description |
|---|---|---|
| `totalNum` | Int | Total number of solved problems |
| `pageNum` | Int | **Total number of pages** (not current page) |
| `data` | Array | List of solved problem items |

**Per `data` item:**

| Field | Type | Description |
|---|---|---|
| `totalSolves` | Int | How many times the user has submitted an accepted solution |
| `question.title` | String | Problem title |
| `question.titleSlug` | String | URL slug |
| `question.questionFrontendId` | String | Display number |
| `question.difficulty` | String | `"Easy"`, `"Medium"`, or `"Hard"` |
| `question.topicTags` | Array | `{ name, slug }` per tag |
| `lastAcSession.time` | String \| null | Unix timestamp in **milliseconds** of the last accepted submission |

### Pagination pattern

```
Page 1 response: totalNum=475, pageNum=10
→ Fetch pages 2, 3, … 10 sequentially
```

Fetch pages **sequentially** (not in parallel) to respect LeetCode's rate limits.

### Example response (single item)

```json
{
  "totalNum": 475,
  "pageNum": 10,
  "data": [
    {
      "totalSolves": 3,
      "question": {
        "title": "Decode String",
        "titleSlug": "decode-string",
        "questionFrontendId": "394",
        "difficulty": "Medium",
        "topicTags": [
          { "name": "String", "slug": "string" },
          { "name": "Stack",  "slug": "stack"  }
        ]
      },
      "lastAcSession": {
        "time": "1776586469.0"
      }
    }
  ]
}
```

---

## Timestamp reference

| Query | Field | Unit |
|---|---|---|
| `recentAcSubmissionList` | `timestamp` | Seconds |
| `userContestRankingHistory` | `contest.startTime` | Seconds |
| `userCalendar` | `submissionCalendar` keys | Seconds |
| `solvedQuestionsInfo` | `lastAcSession.time` | **Milliseconds** |

Convert seconds → ISO 8601: `new Date(Number(ts) * 1000).toISOString()`  
Convert milliseconds → ISO 8601: `new Date(Number(ts)).toISOString()`

---

## GraphQL introspection

The API supports schema introspection. Use it to discover exact input types:

```graphql
{
  __type(name: "QuestionFilterInput") {
    inputFields {
      name
      type { name kind ofType { name kind } }
    }
  }
}
```

Replace `"QuestionFilterInput"` with any type name returned in an error message to drill into its fields.

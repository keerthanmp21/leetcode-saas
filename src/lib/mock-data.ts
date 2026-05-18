// ─── Types (mirror Prisma schema) ────────────────────────────────────────────

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type User = {
  id: string;
  name: string;
  email: string;
  leetcodeUsername: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Problem = {
  id: string;
  questionId: number;
  title: string;
  titleSlug: string;
  difficulty: Difficulty;
  acceptanceRate: number;
  isPaidOnly: boolean;
  topics: string[];
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
};

export type Pattern = {
  id: string;
  name: string;
};

export type ProblemPattern = {
  problemId: string;
  patternId: string;
};

export type SolutionApproach = {
  problemId: string;
  name: string;
  description: string;
};

export type UserProblem = {
  userId: string;
  problemId: string;
  firstSolvedAt: Date;
  lastSolvedAt: Date;
};

export type Submission = {
  id: string;
  userId: string;
  problemId: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  submittedAt: Date;
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: "user_1",
  name: "User",
  email: "user@example.com",
  leetcodeUsername: "leetcode_user",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2026-05-01"),
};

// ─── Patterns ─────────────────────────────────────────────────────────────────

export const mockPatterns: Pattern[] = [
  { id: "pat_1", name: "Two Pointer" },
  { id: "pat_2", name: "Binary Search" },
  { id: "pat_3", name: "Dynamic Programming" },
  { id: "pat_4", name: "Sliding Window" },
  { id: "pat_5", name: "Array" },
  { id: "pat_6", name: "HashMap" },
  { id: "pat_7", name: "Tree" },
  { id: "pat_8", name: "Graph" },
  { id: "pat_9", name: "Greedy" },
  { id: "pat_10", name: "Backtracking" },
  { id: "pat_11", name: "Trie" },
  { id: "pat_12", name: "Union Find" },
  { id: "pat_13", name: "Topological Sort" },
  { id: "pat_14", name: "Shortest Path" },
  { id: "pat_15", name: "Segment Tree" },
];

// ─── Problems ─────────────────────────────────────────────────────────────────

export const mockProblems: Problem[] = [
  // Two Pointer
  {
    id: "prob_1",
    questionId: 1,
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "EASY",
    acceptanceRate: 47.8,
    isPaidOnly: false,
    topics: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "prob_2",
    questionId: 11,
    title: "Container With Most Water",
    titleSlug: "container-with-most-water",
    difficulty: "MEDIUM",
    acceptanceRate: 52.3,
    isPaidOnly: false,
    topics: ["Array", "Greedy"],
    description:
      "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that contains the most water.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_3",
    questionId: 15,
    title: "3Sum",
    titleSlug: "3sum",
    difficulty: "MEDIUM",
    acceptanceRate: 35.2,
    isPaidOnly: true,
    topics: ["Array", "Sorting"],
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
  },
  // Binary Search
  {
    id: "prob_4",
    questionId: 704,
    title: "Binary Search",
    titleSlug: "binary-search",
    difficulty: "EASY",
    acceptanceRate: 54.1,
    isPaidOnly: false,
    topics: ["Array", "Binary Search"],
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_5",
    questionId: 33,
    title: "Search in Rotated Sorted Array",
    titleSlug: "search-in-rotated-sorted-array",
    difficulty: "MEDIUM",
    acceptanceRate: 36.7,
    isPaidOnly: false,
    topics: ["Array", "Binary Search"],
    description:
      "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_6",
    questionId: 4,
    title: "Median of Two Sorted Arrays",
    titleSlug: "median-of-two-sorted-arrays",
    difficulty: "HARD",
    acceptanceRate: 30.8,
    isPaidOnly: true,
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    timeComplexity: "O(log(m+n))",
    spaceComplexity: "O(1)",
  },
  // Dynamic Programming
  {
    id: "prob_7",
    questionId: 70,
    title: "Climbing Stairs",
    titleSlug: "climbing-stairs",
    difficulty: "EASY",
    acceptanceRate: 51.9,
    isPaidOnly: false,
    topics: ["Math", "Dynamic Programming"],
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_8",
    questionId: 322,
    title: "Coin Change",
    titleSlug: "coin-change",
    difficulty: "MEDIUM",
    acceptanceRate: 40.2,
    isPaidOnly: false,
    topics: ["Array", "Dynamic Programming"],
    description:
      "You are given an integer array coins representing coins of various denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    timeComplexity: "O(n × amount)",
    spaceComplexity: "O(amount)",
  },
  {
    id: "prob_9",
    questionId: 32,
    title: "Longest Valid Parentheses",
    titleSlug: "longest-valid-parentheses",
    difficulty: "HARD",
    acceptanceRate: 35.6,
    isPaidOnly: false,
    topics: ["String", "Dynamic Programming"],
    description:
      "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // Sliding Window
  {
    id: "prob_10",
    questionId: 3,
    title: "Longest Substring Without Repeating Characters",
    titleSlug: "longest-substring-without-repeating-characters",
    difficulty: "MEDIUM",
    acceptanceRate: 33.8,
    isPaidOnly: false,
    topics: ["Hash Table", "String", "Sliding Window"],
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
  },
  {
    id: "prob_11",
    questionId: 76,
    title: "Minimum Window Substring",
    titleSlug: "minimum-window-substring",
    difficulty: "HARD",
    acceptanceRate: 40.9,
    isPaidOnly: false,
    topics: ["Hash Table", "String", "Sliding Window"],
    description:
      "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    timeComplexity: "O(m+n)",
    spaceComplexity: "O(m+n)",
  },
  // Tree
  {
    id: "prob_12",
    questionId: 104,
    title: "Maximum Depth of Binary Tree",
    titleSlug: "maximum-depth-of-binary-tree",
    difficulty: "EASY",
    acceptanceRate: 73.2,
    isPaidOnly: false,
    topics: ["Tree", "Depth-First Search", "Binary Tree"],
    description:
      "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
  },
  {
    id: "prob_13",
    questionId: 124,
    title: "Binary Tree Maximum Path Sum",
    titleSlug: "binary-tree-maximum-path-sum",
    difficulty: "HARD",
    acceptanceRate: 38.0,
    isPaidOnly: false,
    topics: ["Tree", "Depth-First Search", "Binary Tree"],
    description:
      "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear in the sequence at most once. Return the maximum path sum of any non-empty path.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
  },
  // Two Pointer (additional)
  {
    id: "prob_16",
    questionId: 125,
    title: "Valid Palindrome",
    titleSlug: "valid-palindrome",
    difficulty: "EASY",
    acceptanceRate: 43.1,
    isPaidOnly: false,
    topics: ["Two Pointers", "String"],
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_17",
    questionId: 42,
    title: "Trapping Rain Water",
    titleSlug: "trapping-rain-water",
    difficulty: "HARD",
    acceptanceRate: 56.9,
    isPaidOnly: false,
    topics: ["Array", "Two Pointers", "Stack"],
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // Binary Search (additional)
  {
    id: "prob_18",
    questionId: 153,
    title: "Find Minimum in Rotated Sorted Array",
    titleSlug: "find-minimum-in-rotated-sorted-array",
    difficulty: "MEDIUM",
    acceptanceRate: 48.3,
    isPaidOnly: false,
    topics: ["Array", "Binary Search"],
    description:
      "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_19",
    questionId: 374,
    title: "Guess Number Higher or Lower",
    titleSlug: "guess-number-higher-or-lower",
    difficulty: "EASY",
    acceptanceRate: 50.8,
    isPaidOnly: false,
    topics: ["Binary Search", "Interactive"],
    description:
      "We are playing the Guess Game. I pick a number from 1 to n. You have to guess which number I picked. Every time you guess wrong, I will tell you whether the number I picked is higher or lower than your guess.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  // Dynamic Programming (additional)
  {
    id: "prob_20",
    questionId: 1143,
    title: "Longest Common Subsequence",
    titleSlug: "longest-common-subsequence",
    difficulty: "MEDIUM",
    acceptanceRate: 56.9,
    isPaidOnly: false,
    topics: ["String", "Dynamic Programming"],
    description:
      "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
  },
  {
    id: "prob_21",
    questionId: 198,
    title: "House Robber",
    titleSlug: "house-robber",
    difficulty: "MEDIUM",
    acceptanceRate: 49.7,
    isPaidOnly: false,
    topics: ["Array", "Dynamic Programming"],
    description:
      "You are a professional robber planning to rob houses along a street. Adjacent houses have security systems connected. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_22",
    questionId: 416,
    title: "Partition Equal Subset Sum",
    titleSlug: "partition-equal-subset-sum",
    difficulty: "MEDIUM",
    acceptanceRate: 46.3,
    isPaidOnly: false,
    topics: ["Array", "Dynamic Programming"],
    description:
      "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.",
    timeComplexity: "O(n × sum)",
    spaceComplexity: "O(sum)",
  },
  // Sliding Window (additional)
  {
    id: "prob_23",
    questionId: 567,
    title: "Permutation in String",
    titleSlug: "permutation-in-string",
    difficulty: "MEDIUM",
    acceptanceRate: 44.8,
    isPaidOnly: false,
    topics: ["Hash Table", "String", "Sliding Window"],
    description:
      "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. In other words, return true if one of s1's permutations is a substring of s2.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_24",
    questionId: 424,
    title: "Longest Repeating Character Replacement",
    titleSlug: "longest-repeating-character-replacement",
    difficulty: "MEDIUM",
    acceptanceRate: 51.2,
    isPaidOnly: false,
    topics: ["Hash Table", "String", "Sliding Window"],
    description:
      "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // Tree (additional)
  {
    id: "prob_25",
    questionId: 98,
    title: "Validate Binary Search Tree",
    titleSlug: "validate-binary-search-tree",
    difficulty: "MEDIUM",
    acceptanceRate: 32.2,
    isPaidOnly: false,
    topics: ["Tree", "Depth-First Search", "Binary Search Tree"],
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "prob_26",
    questionId: 102,
    title: "Binary Tree Level Order Traversal",
    titleSlug: "binary-tree-level-order-traversal",
    difficulty: "MEDIUM",
    acceptanceRate: 65.3,
    isPaidOnly: false,
    topics: ["Tree", "Breadth-First Search", "Binary Tree"],
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "prob_27",
    questionId: 297,
    title: "Serialize and Deserialize Binary Tree",
    titleSlug: "serialize-and-deserialize-binary-tree",
    difficulty: "HARD",
    acceptanceRate: 55.4,
    isPaidOnly: false,
    topics: ["String", "Tree", "Depth-First Search", "Breadth-First Search"],
    description:
      "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // Graph
  {
    id: "prob_28",
    questionId: 200,
    title: "Number of Islands",
    titleSlug: "number-of-islands",
    difficulty: "MEDIUM",
    acceptanceRate: 57.0,
    isPaidOnly: false,
    topics: ["Array", "Depth-First Search", "Breadth-First Search", "Graph"],
    description:
      "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
  },
  {
    id: "prob_29",
    questionId: 207,
    title: "Course Schedule",
    titleSlug: "course-schedule",
    difficulty: "MEDIUM",
    acceptanceRate: 45.3,
    isPaidOnly: false,
    topics: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    description:
      "There are a total of numCourses courses you have to take. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
  },
  {
    id: "prob_30",
    questionId: 417,
    title: "Pacific Atlantic Water Flow",
    titleSlug: "pacific-atlantic-water-flow",
    difficulty: "MEDIUM",
    acceptanceRate: 54.5,
    isPaidOnly: false,
    topics: ["Array", "Depth-First Search", "Breadth-First Search", "Graph"],
    description:
      "Given an m x n matrix of non-negative integers representing the height of each unit cell in a continent, find the list of grid coordinates where water can flow to both the Pacific and Atlantic ocean.",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
  },
  // HashMap (additional)
  {
    id: "prob_31",
    questionId: 49,
    title: "Group Anagrams",
    titleSlug: "group-anagrams",
    difficulty: "MEDIUM",
    acceptanceRate: 66.3,
    isPaidOnly: false,
    topics: ["Array", "Hash Table", "String", "Sorting"],
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    timeComplexity: "O(n × k log k)",
    spaceComplexity: "O(n × k)",
  },
  {
    id: "prob_32",
    questionId: 347,
    title: "Top K Frequent Elements",
    titleSlug: "top-k-frequent-elements",
    difficulty: "MEDIUM",
    acceptanceRate: 63.1,
    isPaidOnly: false,
    topics: ["Array", "Hash Table", "Sorting", "Heap"],
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n)",
  },
  // Greedy
  {
    id: "prob_14",
    questionId: 55,
    title: "Jump Game",
    titleSlug: "jump-game",
    difficulty: "MEDIUM",
    acceptanceRate: 38.8,
    isPaidOnly: false,
    topics: ["Array", "Greedy"],
    description:
      "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_33",
    questionId: 45,
    title: "Jump Game II",
    titleSlug: "jump-game-ii",
    difficulty: "MEDIUM",
    acceptanceRate: 39.8,
    isPaidOnly: false,
    topics: ["Array", "Greedy"],
    description:
      "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "prob_34",
    questionId: 134,
    title: "Gas Station",
    titleSlug: "gas-station",
    difficulty: "MEDIUM",
    acceptanceRate: 44.1,
    isPaidOnly: false,
    topics: ["Array", "Greedy"],
    description:
      "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // Backtracking
  {
    id: "prob_15",
    questionId: 46,
    title: "Permutations",
    titleSlug: "permutations",
    difficulty: "MEDIUM",
    acceptanceRate: 73.4,
    isPaidOnly: false,
    topics: ["Array", "Backtracking"],
    description:
      "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
  },
  {
    id: "prob_35",
    questionId: 78,
    title: "Subsets",
    titleSlug: "subsets",
    difficulty: "MEDIUM",
    acceptanceRate: 73.0,
    isPaidOnly: false,
    topics: ["Array", "Backtracking", "Bit Manipulation"],
    description:
      "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n × 2^n)",
  },
  {
    id: "prob_36",
    questionId: 51,
    title: "N-Queens",
    titleSlug: "n-queens",
    difficulty: "HARD",
    acceptanceRate: 65.5,
    isPaidOnly: false,
    topics: ["Array", "Backtracking"],
    description:
      "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n²)",
  },
  // Trie
  {
    id: "prob_37",
    questionId: 208,
    title: "Implement Trie (Prefix Tree)",
    titleSlug: "implement-trie-prefix-tree",
    difficulty: "MEDIUM",
    acceptanceRate: 58.7,
    isPaidOnly: false,
    topics: ["Hash Table", "String", "Design", "Trie"],
    description:
      "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods.",
    timeComplexity: "O(m)",
    spaceComplexity: "O(m)",
  },
  {
    id: "prob_38",
    questionId: 212,
    title: "Word Search II",
    titleSlug: "word-search-ii",
    difficulty: "HARD",
    acceptanceRate: 37.4,
    isPaidOnly: false,
    topics: ["Array", "String", "Backtracking", "Trie"],
    description:
      "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells. The same letter cell may not be used more than once in a word.",
    timeComplexity: "O(m × n × 4^l)",
    spaceComplexity: "O(l)",
  },
];

// ─── Problem → Pattern mappings ───────────────────────────────────────────────

export const mockProblemPatterns: ProblemPattern[] = [
  { problemId: "prob_1", patternId: "pat_6" }, // Two Sum → HashMap
  { problemId: "prob_1", patternId: "pat_1" }, // Two Sum → Two Pointer
  { problemId: "prob_2", patternId: "pat_1" }, // Container With Most Water → Two Pointer
  { problemId: "prob_3", patternId: "pat_1" }, // 3Sum → Two Pointer
  { problemId: "prob_4", patternId: "pat_2" }, // Binary Search → Binary Search
  { problemId: "prob_5", patternId: "pat_2" }, // Search in Rotated → Binary Search
  { problemId: "prob_6", patternId: "pat_2" }, // Median of Two → Binary Search
  { problemId: "prob_7", patternId: "pat_3" }, // Climbing Stairs → DP
  { problemId: "prob_8", patternId: "pat_3" }, // Coin Change → DP
  { problemId: "prob_9", patternId: "pat_3" }, // Longest Valid Parens → DP
  { problemId: "prob_10", patternId: "pat_4" }, // Longest Substring → Sliding Window
  { problemId: "prob_11", patternId: "pat_4" }, // Min Window Substring → Sliding Window
  { problemId: "prob_12", patternId: "pat_7" }, // Max Depth Binary Tree → Tree
  { problemId: "prob_13", patternId: "pat_7" }, // Binary Tree Max Path → Tree
  { problemId: "prob_14", patternId: "pat_9" }, // Jump Game → Greedy
  { problemId: "prob_15", patternId: "pat_10" }, // Permutations → Backtracking
  { problemId: "prob_16", patternId: "pat_1" }, // Valid Palindrome → Two Pointer
  { problemId: "prob_17", patternId: "pat_1" }, // Trapping Rain Water → Two Pointer
  { problemId: "prob_18", patternId: "pat_2" }, // Find Minimum Rotated → Binary Search
  { problemId: "prob_19", patternId: "pat_2" }, // Guess Number → Binary Search
  { problemId: "prob_20", patternId: "pat_3" }, // LCS → DP
  { problemId: "prob_21", patternId: "pat_3" }, // House Robber → DP
  { problemId: "prob_22", patternId: "pat_3" }, // Partition Equal Subset → DP
  { problemId: "prob_23", patternId: "pat_4" }, // Permutation in String → Sliding Window
  { problemId: "prob_24", patternId: "pat_4" }, // Longest Repeating Char Replacement → Sliding Window
  { problemId: "prob_25", patternId: "pat_7" }, // Validate BST → Tree
  { problemId: "prob_26", patternId: "pat_7" }, // Level Order Traversal → Tree
  { problemId: "prob_27", patternId: "pat_7" }, // Serialize Deserialize → Tree
  { problemId: "prob_28", patternId: "pat_8" }, // Number of Islands → Graph
  { problemId: "prob_29", patternId: "pat_8" }, // Course Schedule → Graph
  { problemId: "prob_30", patternId: "pat_8" }, // Pacific Atlantic → Graph
  { problemId: "prob_31", patternId: "pat_6" }, // Group Anagrams → HashMap
  { problemId: "prob_32", patternId: "pat_6" }, // Top K Frequent → HashMap
  { problemId: "prob_33", patternId: "pat_9" }, // Jump Game II → Greedy
  { problemId: "prob_34", patternId: "pat_9" }, // Gas Station → Greedy
  { problemId: "prob_35", patternId: "pat_10" }, // Subsets → Backtracking
  { problemId: "prob_36", patternId: "pat_10" }, // N-Queens → Backtracking
  { problemId: "prob_37", patternId: "pat_11" }, // Implement Trie → Trie
  { problemId: "prob_38", patternId: "pat_11" }, // Word Search II → Trie
];

// ─── Solution approaches per problem (shown in the detail drawer) ─────────────

export const mockSolutionApproaches: SolutionApproach[] = [
  // Two Sum
  {
    problemId: "prob_1",
    name: "Hash Table",
    description: "Use hash map for O(n) solution with single pass",
  },
  {
    problemId: "prob_1",
    name: "Brute Force",
    description: "Check all pairs with nested loops",
  },
  {
    problemId: "prob_1",
    name: "Sorting + Two Pointer",
    description: "Sort array then use two pointers approach",
  },
  // Container With Most Water
  {
    problemId: "prob_2",
    name: "Two Pointer",
    description: "Start from both ends, move the shorter line inward",
  },
  {
    problemId: "prob_2",
    name: "Brute Force",
    description: "Check all pairs of lines",
  },
  // 3Sum
  {
    problemId: "prob_3",
    name: "Sort + Two Pointer",
    description: "Sort array, fix one element, use two pointers for the rest",
  },
  {
    problemId: "prob_3",
    name: "Hash Set",
    description: "Use a hash set to find complements",
  },
  // Binary Search
  {
    problemId: "prob_4",
    name: "Binary Search",
    description: "Classic binary search with left and right pointers",
  },
  // Search in Rotated Sorted Array
  {
    problemId: "prob_5",
    name: "Modified Binary Search",
    description: "Determine which half is sorted, then binary search",
  },
  // Median of Two Sorted Arrays
  {
    problemId: "prob_6",
    name: "Binary Search on Partition",
    description: "Binary search on the smaller array to find the correct partition",
  },
  {
    problemId: "prob_6",
    name: "Merge and Find",
    description: "Merge both arrays and return the median element",
  },
  // Climbing Stairs
  {
    problemId: "prob_7",
    name: "Dynamic Programming",
    description: "dp[i] = dp[i-1] + dp[i-2], same as Fibonacci",
  },
  {
    problemId: "prob_7",
    name: "Space-Optimized DP",
    description: "Keep only last two values instead of full dp array",
  },
  // Coin Change
  {
    problemId: "prob_8",
    name: "Bottom-Up DP",
    description: "Build up solutions for every amount from 0 to target",
  },
  {
    problemId: "prob_8",
    name: "BFS",
    description: "Treat as shortest path problem using BFS",
  },
  // Longest Valid Parentheses
  {
    problemId: "prob_9",
    name: "Stack",
    description: "Use a stack to track indices of unmatched parentheses",
  },
  {
    problemId: "prob_9",
    name: "Dynamic Programming",
    description: "dp[i] = length of longest valid substring ending at i",
  },
  // Longest Substring
  {
    problemId: "prob_10",
    name: "Sliding Window + Hash Map",
    description: "Expand window, shrink from left when duplicate found",
  },
  // Minimum Window Substring
  {
    problemId: "prob_11",
    name: "Sliding Window",
    description: "Expand right until window is valid, shrink left to minimize",
  },
];

// ─── Solved problems (UserProblem join table) ─────────────────────────────────

export const mockUserProblems: UserProblem[] = [
  {
    userId: "user_1",
    problemId: "prob_1",
    firstSolvedAt: new Date("2025-03-10"),
    lastSolvedAt: new Date("2026-04-20"),
  },
  {
    userId: "user_1",
    problemId: "prob_2",
    firstSolvedAt: new Date("2025-03-15"),
    lastSolvedAt: new Date("2025-03-15"),
  },
  {
    userId: "user_1",
    problemId: "prob_4",
    firstSolvedAt: new Date("2025-04-01"),
    lastSolvedAt: new Date("2025-04-01"),
  },
  {
    userId: "user_1",
    problemId: "prob_5",
    firstSolvedAt: new Date("2025-04-05"),
    lastSolvedAt: new Date("2026-05-10"),
  },
  {
    userId: "user_1",
    problemId: "prob_7",
    firstSolvedAt: new Date("2025-02-20"),
    lastSolvedAt: new Date("2025-02-20"),
  },
  {
    userId: "user_1",
    problemId: "prob_8",
    firstSolvedAt: new Date("2025-05-01"),
    lastSolvedAt: new Date("2026-05-12"),
  },
  {
    userId: "user_1",
    problemId: "prob_10",
    firstSolvedAt: new Date("2025-06-10"),
    lastSolvedAt: new Date("2025-06-10"),
  },
  {
    userId: "user_1",
    problemId: "prob_12",
    firstSolvedAt: new Date("2025-07-01"),
    lastSolvedAt: new Date("2025-07-01"),
  },
  {
    userId: "user_1",
    problemId: "prob_14",
    firstSolvedAt: new Date("2025-07-15"),
    lastSolvedAt: new Date("2026-05-14"),
  },
  {
    userId: "user_1",
    problemId: "prob_15",
    firstSolvedAt: new Date("2026-05-01"),
    lastSolvedAt: new Date("2026-05-01"),
  },
];

// ─── Submissions ──────────────────────────────────────────────────────────────

export const mockSubmissions: Submission[] = [
  {
    id: "sub_1",
    userId: "user_1",
    problemId: "prob_1",
    status: "Accepted",
    language: "Python3",
    runtime: "52 ms",
    memory: "16.4 MB",
    submittedAt: new Date("2025-03-10T10:30:00"),
  },
  {
    id: "sub_2",
    userId: "user_1",
    problemId: "prob_1",
    status: "Wrong Answer",
    language: "Python3",
    runtime: "N/A",
    memory: "N/A",
    submittedAt: new Date("2025-03-10T10:15:00"),
  },
  {
    id: "sub_3",
    userId: "user_1",
    problemId: "prob_2",
    status: "Accepted",
    language: "Python3",
    runtime: "108 ms",
    memory: "27.8 MB",
    submittedAt: new Date("2025-03-15T14:20:00"),
  },
  {
    id: "sub_4",
    userId: "user_1",
    problemId: "prob_4",
    status: "Accepted",
    language: "TypeScript",
    runtime: "68 ms",
    memory: "44.1 MB",
    submittedAt: new Date("2025-04-01T09:45:00"),
  },
  {
    id: "sub_5",
    userId: "user_1",
    problemId: "prob_5",
    status: "Accepted",
    language: "Python3",
    runtime: "61 ms",
    memory: "16.5 MB",
    submittedAt: new Date("2026-05-10T11:00:00"),
  },
  {
    id: "sub_6",
    userId: "user_1",
    problemId: "prob_8",
    status: "Accepted",
    language: "Python3",
    runtime: "145 ms",
    memory: "14.2 MB",
    submittedAt: new Date("2026-05-12T16:30:00"),
  },
  {
    id: "sub_7",
    userId: "user_1",
    problemId: "prob_14",
    status: "Accepted",
    language: "TypeScript",
    runtime: "55 ms",
    memory: "44.6 MB",
    submittedAt: new Date("2026-05-14T20:10:00"),
  },
  {
    id: "sub_8",
    userId: "user_1",
    problemId: "prob_15",
    status: "Accepted",
    language: "Python3",
    runtime: "38 ms",
    memory: "16.9 MB",
    submittedAt: new Date("2026-05-01T13:00:00"),
  },
];

// ─── Dashboard stats ──────────────────────────────────────────────────────────
// Pre-computed to match the dashboard UI (represents full account data, not
// just the problems defined above).

export const mockDashboardStats = {
  totalSolved: 142,
  solvedThisMonth: 12,
  easy: 78,
  medium: 52,
  hard: 12,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLeetCodeUrl(titleSlug: string): string {
  return `https://leetcode.com/problems/${titleSlug}/`;
}

export function isSolved(problemId: string): boolean {
  return mockUserProblems.some((up) => up.problemId === problemId);
}

export function getPatternById(patternId: string): Pattern | undefined {
  return mockPatterns.find((p) => p.id === patternId);
}

export function getProblemById(problemId: string): Problem | undefined {
  return mockProblems.find((p) => p.id === problemId);
}

/** Returns problems grouped by pattern, preserving pattern order. */
export function getProblemsGroupedByPattern(): {
  pattern: Pattern;
  problems: Problem[];
}[] {
  return mockPatterns
    .map((pattern) => {
      const problemIds = mockProblemPatterns
        .filter((pp) => pp.patternId === pattern.id)
        .map((pp) => pp.problemId);

      const problems = problemIds
        .map((id) => getProblemById(id))
        .filter((p): p is Problem => p !== undefined);

      return { pattern, problems };
    })
    .filter(({ problems }) => problems.length > 0);
}

/** Returns solution approaches for a given problem. */
export function getSolutionApproaches(problemId: string): SolutionApproach[] {
  return mockSolutionApproaches.filter((sa) => sa.problemId === problemId);
}

/** Returns the most recent submissions, newest first. */
export function getRecentSubmissions(limit = 10): Submission[] {
  return [...mockSubmissions]
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, limit);
}

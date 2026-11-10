// Demo data for `SEED_DEMO=true`. Dates are offsets from "now" so countdowns
// and "due today" stay correct whenever the seed runs.
import { Rating } from "../../src/generated/prisma/enums";

export const DEMO_USER = {
  email: "demo@studystash.io",
  name: "Demo Student",
  password: "12345678",
  isPro: true,
  reviewStreak: 4,
  timezone: "Asia/Yangon",
} as const;

export const BCRYPT_ROUNDS = 12;

export type SystemTypeName = "note" | "flashcard" | "formula" | "question" | "link" | "video";

export const URL_TYPES: readonly SystemTypeName[] = ["link", "video"];

export type CollectionKey = "calculus" | "orgchem" | "ielts" | "typescript" | "final";

export interface DemoCollection {
  key: CollectionKey;
  name: string;
  description: string;
  examInDays: number | null;
  isFavorite: boolean;
  updatedDaysAgo: number;
}

export const DEMO_COLLECTIONS: readonly DemoCollection[] = [
  {
    key: "calculus",
    name: "Calculus II",
    description: "Integration techniques, series and exam practice",
    examInDays: 12,
    isFavorite: true,
    updatedDaysAgo: 1,
  },
  {
    key: "orgchem",
    name: "Organic Chemistry",
    description: "Reaction mechanisms and key definitions",
    examInDays: null,
    isFavorite: false,
    updatedDaysAgo: 6,
  },
  {
    key: "ielts",
    name: "IELTS Vocabulary",
    description: "Academic word list and writing phrases",
    examInDays: 30,
    isFavorite: true,
    updatedDaysAgo: 0,
  },
  {
    key: "typescript",
    name: "Learn TypeScript",
    description: "Notes and practice while learning TypeScript",
    examInDays: null,
    isFavorite: false,
    updatedDaysAgo: 4,
  },
  {
    key: "final",
    name: "Final Exam Prep",
    description: "Everything to revise before finals",
    examInDays: 3,
    isFavorite: false,
    updatedDaysAgo: 2,
  },
];

export const DEMO_TAGS = [
  "calculus",
  "integration",
  "chemistry",
  "definitions",
  "ielts",
  "vocabulary",
  "typescript",
  "exam",
] as const;

export type TagName = (typeof DEMO_TAGS)[number];

/**
 * Flashcard review state.
 * - `due`: reviewed before, due `overdueDays` ago (0 = earlier today)
 * - `new`: never reviewed, due now
 * - `later`: reviewed before, due in `dueInDays` (2–10)
 */
export type DemoReviewState =
  | { group: "due"; overdueDays: number; interval: number; repetitions: number; easeFactor: number }
  | { group: "new" }
  | { group: "later"; dueInDays: number; interval: number; repetitions: number; easeFactor: number };

export interface DemoItem {
  title: string;
  type: SystemTypeName;
  collection: CollectionKey;
  alsoIn?: CollectionKey[];
  description?: string;
  content?: string;
  answer?: string;
  url?: string;
  tags: TagName[];
  createdDaysAgo: number;
  updatedDaysAgo?: number;
  isPinned?: boolean;
  isFavorite?: boolean;
  review?: DemoReviewState;
}

const CALCULUS_ITEMS: DemoItem[] = [
  {
    title: "Integration by Parts",
    type: "note",
    collection: "calculus",
    description: "Lecture 7 summary",
    content:
      "## Integration by Parts\n\nUse when the integrand is a product of two functions.\n\nChoose $u$ with **LIATE**: Logarithmic, Inverse trig, Algebraic, Trig, Exponential.\n\nExample: $\\int x e^x \\, dx = x e^x - e^x + C$",
    tags: ["calculus", "integration"],
    createdDaysAgo: 13,
    updatedDaysAgo: 1,
    isFavorite: true,
  },
  {
    title: "Series Convergence Tests",
    type: "note",
    collection: "calculus",
    description: "Which test to try first",
    content:
      "## Convergence Tests\n\n1. **Divergence test**: if $\\lim a_n \\neq 0$, the series diverges\n2. **Geometric / p-series**: $\\sum \\frac{1}{n^p}$ converges iff $p > 1$\n3. **Comparison**: compare with a known series\n4. **Ratio test**: best for factorials and exponentials\n5. **Alternating series test**: terms decrease to $0$",
    tags: ["calculus"],
    createdDaysAgo: 11,
    updatedDaysAgo: 3,
  },
  {
    title: "Integration by Parts Formula",
    type: "formula",
    collection: "calculus",
    alsoIn: ["final"],
    content: "\\int u \\, dv = uv - \\int v \\, du",
    tags: ["calculus", "integration", "exam"],
    createdDaysAgo: 13,
    isPinned: true,
  },
  {
    title: "Power Rule for Integration",
    type: "formula",
    collection: "calculus",
    content: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad n \\neq -1",
    tags: ["calculus", "integration"],
    createdDaysAgo: 12,
  },
  {
    title: "Ratio Test",
    type: "formula",
    collection: "calculus",
    alsoIn: ["final"],
    description: "Converges if L < 1, diverges if L > 1, inconclusive if L = 1",
    content: "L = \\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|",
    tags: ["calculus", "exam"],
    createdDaysAgo: 10,
    isFavorite: true,
  },
  {
    title: "2025 Final, Question 3",
    type: "question",
    collection: "calculus",
    alsoIn: ["final"],
    description: "Past exam question",
    content: "Evaluate $\\int_0^1 x \\ln x \\, dx$.",
    answer:
      "Let $u = \\ln x$, $dv = x\\,dx$. Then $\\int_0^1 x \\ln x \\, dx = \\left[\\frac{x^2}{2}\\ln x\\right]_0^1 - \\int_0^1 \\frac{x}{2}\\,dx = 0 - \\frac{1}{4} = -\\frac{1}{4}$",
    tags: ["calculus", "integration", "exam"],
    createdDaysAgo: 9,
  },
  {
    title: "2024 Final, Question 5",
    type: "question",
    collection: "calculus",
    description: "Past exam question, solution not released yet",
    content: "Determine whether $\\sum_{n=1}^{\\infty} \\frac{n!}{n^n}$ converges or diverges.",
    tags: ["calculus", "exam"],
    createdDaysAgo: 8,
  },
  {
    title: "Essence of Calculus (3Blue1Brown)",
    type: "video",
    collection: "calculus",
    description: "Visual intuition for derivatives and integrals",
    url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",
    tags: ["calculus"],
    createdDaysAgo: 7,
  },
];

const ORGCHEM_ITEMS: DemoItem[] = [
  {
    title: "SN1 vs SN2",
    type: "note",
    collection: "orgchem",
    alsoIn: ["final"],
    description: "Nucleophilic substitution compared",
    content:
      "## SN1 vs SN2\n\n| | SN1 | SN2 |\n| --- | --- | --- |\n| Steps | Two (carbocation) | One, concerted |\n| Rate | $k[\\text{substrate}]$ | $k[\\text{substrate}][\\text{Nu}]$ |\n| Substrate | Tertiary | Primary |\n| Stereo | Racemization | Inversion |\n| Solvent | Polar protic | Polar aprotic |",
    tags: ["chemistry", "exam"],
    createdDaysAgo: 14,
    updatedDaysAgo: 5,
    isPinned: true,
  },
  {
    title: "Functional Groups",
    type: "note",
    collection: "orgchem",
    content:
      "## Functional Groups\n\n- **Alcohol**: $-OH$\n- **Aldehyde**: $-CHO$\n- **Ketone**: $C=O$ between two carbons\n- **Carboxylic acid**: $-COOH$\n- **Ester**: $-COO-$\n- **Amine**: $-NH_2$",
    tags: ["chemistry", "definitions"],
    createdDaysAgo: 14,
  },
  {
    title: "Nucleophile",
    type: "flashcard",
    collection: "orgchem",
    alsoIn: ["final"],
    content: "What is a nucleophile?",
    answer: "An electron-rich species that donates an electron pair to form a new bond, e.g. $OH^-$, $CN^-$, $NH_3$.",
    tags: ["chemistry", "definitions", "exam"],
    createdDaysAgo: 13,
    review: { group: "due", overdueDays: 1, interval: 1, repetitions: 1, easeFactor: 2.36 },
  },
  {
    title: "Electrophile",
    type: "flashcard",
    collection: "orgchem",
    alsoIn: ["final"],
    content: "What is an electrophile?",
    answer: "An electron-poor species that accepts an electron pair, e.g. a carbocation or the carbon in $C-Br$.",
    tags: ["chemistry", "definitions", "exam"],
    createdDaysAgo: 13,
    review: { group: "due", overdueDays: 0, interval: 6, repetitions: 2, easeFactor: 2.5 },
  },
  {
    title: "Chirality",
    type: "flashcard",
    collection: "orgchem",
    content: "What makes a molecule chiral?",
    answer: "It is not superimposable on its mirror image, usually because of a carbon with four different groups.",
    tags: ["chemistry", "definitions"],
    createdDaysAgo: 12,
    review: { group: "later", dueInDays: 5, interval: 6, repetitions: 2, easeFactor: 2.6 },
  },
  {
    title: "Isomer",
    type: "flashcard",
    collection: "orgchem",
    content: "What are isomers?",
    answer: "Compounds with the same molecular formula but a different arrangement of atoms (structural or stereoisomers).",
    tags: ["chemistry", "definitions"],
    createdDaysAgo: 12,
    review: { group: "later", dueInDays: 9, interval: 15, repetitions: 3, easeFactor: 2.7 },
  },
  {
    title: "Khan Academy: Organic Chemistry",
    type: "link",
    collection: "orgchem",
    description: "Free videos and practice on mechanisms",
    url: "https://www.khanacademy.org/science/organic-chemistry",
    tags: ["chemistry"],
    createdDaysAgo: 11,
  },
];

const IELTS_ITEMS: DemoItem[] = [
  {
    title: "Ubiquitous",
    type: "flashcard",
    collection: "ielts",
    content: "Ubiquitous (adj.)",
    answer: "Present or found everywhere. *Smartphones have become ubiquitous in modern life.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 10,
    isFavorite: true,
    review: { group: "due", overdueDays: 2, interval: 1, repetitions: 1, easeFactor: 2.18 },
  },
  {
    title: "Mitigate",
    type: "flashcard",
    collection: "ielts",
    content: "Mitigate (v.)",
    answer: "To make something less severe or harmful. *Planting trees can mitigate the effects of climate change.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 10,
    review: { group: "due", overdueDays: 0, interval: 1, repetitions: 1, easeFactor: 2.5 },
  },
  {
    title: "Ambiguous",
    type: "flashcard",
    collection: "ielts",
    content: "Ambiguous (adj.)",
    answer: "Open to more than one interpretation. *The question was ambiguous, so many candidates misread it.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 9,
    review: { group: "due", overdueDays: 1, interval: 6, repetitions: 2, easeFactor: 2.36 },
  },
  {
    title: "Coherent",
    type: "flashcard",
    collection: "ielts",
    content: "Coherent (adj.)",
    answer: "Logical and consistent. *A coherent essay links each paragraph to the main argument.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 9,
    review: { group: "later", dueInDays: 2, interval: 6, repetitions: 2, easeFactor: 2.5 },
  },
  {
    title: "Substantial",
    type: "flashcard",
    collection: "ielts",
    content: "Substantial (adj.)",
    answer: "Large in size, value or importance. *There has been a substantial increase in online learning.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 8,
    review: { group: "later", dueInDays: 7, interval: 14, repetitions: 3, easeFactor: 2.46 },
  },
  {
    title: "Inevitable",
    type: "flashcard",
    collection: "ielts",
    content: "Inevitable (adj.)",
    answer: "Certain to happen; unavoidable. *Some job losses are inevitable as automation spreads.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 3,
    review: { group: "new" },
  },
  {
    title: "Paradigm",
    type: "flashcard",
    collection: "ielts",
    content: "Paradigm (n.)",
    answer: "A typical model or pattern of thinking. *Remote work represents a paradigm shift in employment.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 2,
    review: { group: "new" },
  },
  {
    title: "Empirical",
    type: "flashcard",
    collection: "ielts",
    content: "Empirical (adj.)",
    answer: "Based on observation or experiment rather than theory. *There is little empirical evidence for this claim.*",
    tags: ["ielts", "vocabulary"],
    createdDaysAgo: 1,
    review: { group: "new" },
  },
  {
    title: "Task 2 Essay Structure",
    type: "note",
    collection: "ielts",
    description: "Four-paragraph template, ~270 words",
    content:
      "## Task 2 Structure\n\n1. **Introduction**: paraphrase the question + clear position\n2. **Body 1**: main reason + example\n3. **Body 2**: second reason or counter-argument + example\n4. **Conclusion**: restate the position, no new ideas\n\nUseful phrases: *It is widely argued that…*, *On the other hand…*, *In conclusion, I firmly believe…*",
    tags: ["ielts", "exam"],
    createdDaysAgo: 6,
    updatedDaysAgo: 0,
    isPinned: true,
  },
  {
    title: "IELTS Official Site",
    type: "link",
    collection: "ielts",
    description: "Test format, scoring and band descriptors",
    url: "https://www.ielts.org/",
    tags: ["ielts"],
    createdDaysAgo: 10,
  },
];

const TYPESCRIPT_ITEMS: DemoItem[] = [
  {
    title: "Generics",
    type: "note",
    collection: "typescript",
    content:
      "## Generics\n\nGenerics let a function keep the type of its input.\n\n```ts\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst n = first([1, 2, 3]); // number | undefined\n```\n\nConstrain with `extends`: `function getId<T extends { id: string }>(x: T) { return x.id; }`",
    tags: ["typescript"],
    createdDaysAgo: 5,
    updatedDaysAgo: 4,
    isFavorite: true,
  },
  {
    title: "Utility Types",
    type: "note",
    collection: "typescript",
    content:
      "## Utility Types\n\n```ts\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\ntype UserPreview = Pick<User, \"id\" | \"name\">;\ntype UserUpdate = Partial<Omit<User, \"id\">>;\ntype UserMap = Record<string, User>;\n```",
    tags: ["typescript"],
    createdDaysAgo: 4,
  },
  {
    title: "Type Narrowing",
    type: "flashcard",
    collection: "typescript",
    content: "What is type narrowing?",
    answer: "Refining a broad type to a more specific one with checks like `typeof`, `in`, `instanceof` or a discriminant property.",
    tags: ["typescript", "definitions"],
    createdDaysAgo: 5,
    review: { group: "due", overdueDays: 0, interval: 1, repetitions: 1, easeFactor: 2.5 },
  },
  {
    title: "unknown vs any",
    type: "flashcard",
    collection: "typescript",
    content: "What is the difference between `unknown` and `any`?",
    answer: "`any` turns off type checking. `unknown` accepts any value but must be narrowed before you use it.",
    tags: ["typescript", "definitions"],
    createdDaysAgo: 5,
    review: { group: "later", dueInDays: 4, interval: 6, repetitions: 2, easeFactor: 2.6 },
  },
  {
    title: "Structural Typing",
    type: "flashcard",
    collection: "typescript",
    content: "What does it mean that TypeScript is structurally typed?",
    answer: "Types are compatible if their shapes match, regardless of their names.",
    tags: ["typescript", "definitions"],
    createdDaysAgo: 2,
    review: { group: "new" },
  },
  {
    title: "TypeScript Handbook",
    type: "link",
    collection: "typescript",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    tags: ["typescript"],
    createdDaysAgo: 5,
    isFavorite: true,
  },
  {
    title: "MDN JavaScript Guide",
    type: "link",
    collection: "typescript",
    description: "JavaScript fundamentals behind TypeScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    tags: ["typescript"],
    createdDaysAgo: 4,
  },
  {
    title: "Matt Pocock (YouTube)",
    type: "video",
    collection: "typescript",
    description: "Short TypeScript tips and deep dives",
    url: "https://www.youtube.com/@mattpocockuk",
    tags: ["typescript"],
    createdDaysAgo: 3,
  },
];

export const DEMO_ITEMS: readonly DemoItem[] = [
  ...CALCULUS_ITEMS,
  ...ORGCHEM_ITEMS,
  ...IELTS_ITEMS,
  ...TYPESCRIPT_ITEMS,
];

/** Flashcard reviews per day, oldest first. Logged cards must have a non-`new` review state. */
export const DEMO_REVIEW_HISTORY: readonly { daysAgo: number; reviews: [string, Rating][] }[] = [
  {
    daysAgo: 4,
    reviews: [
      ["Nucleophile", Rating.GOOD],
      ["Electrophile", Rating.GOOD],
      ["Chirality", Rating.GOOD],
      ["Isomer", Rating.EASY],
      ["Ubiquitous", Rating.HARD],
    ],
  },
  {
    daysAgo: 3,
    reviews: [
      ["Ubiquitous", Rating.AGAIN],
      ["Ambiguous", Rating.GOOD],
      ["Coherent", Rating.GOOD],
    ],
  },
  {
    daysAgo: 2,
    reviews: [
      ["Ambiguous", Rating.GOOD],
      ["Coherent", Rating.EASY],
      ["Substantial", Rating.GOOD],
      ["Mitigate", Rating.HARD],
      ["Type Narrowing", Rating.GOOD],
      ["unknown vs any", Rating.GOOD],
      ["Chirality", Rating.GOOD],
      ["Isomer", Rating.GOOD],
    ],
  },
  {
    daysAgo: 1,
    reviews: [
      ["Nucleophile", Rating.AGAIN],
      ["Electrophile", Rating.GOOD],
      ["Mitigate", Rating.GOOD],
      ["Type Narrowing", Rating.AGAIN],
      ["unknown vs any", Rating.EASY],
      ["Substantial", Rating.GOOD],
    ],
  },
];

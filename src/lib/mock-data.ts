// Mock data from before the database existed. The app no longer imports it; kept for tests or Storybook.
// Dates are plain ISO date strings (YYYY-MM-DD) so they stay serializable for client components.

export type MockContentType = "TEXT" | "URL" | "FILE";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
  reviewStreak: number;
  cardsDueToday: number;
  timezone: string;
}

export interface MockItemType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string | null;
  examDate: string | null;
  isFavorite: boolean;
  itemCount: number;
  updatedAt: string;
}

export interface MockItem {
  id: string;
  title: string;
  description: string | null;
  contentType: MockContentType;
  itemTypeId: string;
  content: string | null;
  answer: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockUser: MockUser = {
  id: "user_1",
  name: "Aung Kyaw",
  email: "aung@example.com",
  image: null,
  isPro: true,
  reviewStreak: 12,
  cardsDueToday: 18,
  timezone: "Asia/Yangon",
};

export const mockItemTypes: MockItemType[] = [
  { id: "type_note", name: "note", slug: "notes", icon: "NotebookPen", color: "#3b82f6", isSystem: true },
  { id: "type_flashcard", name: "flashcard", slug: "flashcards", icon: "Layers", color: "#8b5cf6", isSystem: true },
  { id: "type_formula", name: "formula", slug: "formulas", icon: "Sigma", color: "#f97316", isSystem: true },
  { id: "type_question", name: "question", slug: "questions", icon: "CircleHelp", color: "#fde047", isSystem: true },
  { id: "type_link", name: "link", slug: "links", icon: "Link", color: "#10b981", isSystem: true },
  { id: "type_video", name: "video", slug: "videos", icon: "Video", color: "#ef4444", isSystem: true },
  { id: "type_file", name: "file", slug: "files", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type_image", name: "image", slug: "images", icon: "Image", color: "#ec4899", isSystem: true },
];

export const mockCollections: MockCollection[] = [
  {
    id: "col_calculus",
    name: "Calculus II",
    description: "Integration techniques, series and parametric equations",
    examDate: "2026-12-14",
    isFavorite: true,
    itemCount: 5,
    updatedAt: "2026-11-04",
  },
  {
    id: "col_ielts",
    name: "IELTS Vocabulary",
    description: "Academic word list and topic vocabulary",
    examDate: "2027-01-23",
    isFavorite: true,
    itemCount: 3,
    updatedAt: "2026-11-05",
  },
  {
    id: "col_final",
    name: "Final Exam Prep",
    description: "Mixed revision for end-of-semester exams",
    examDate: "2026-12-08",
    isFavorite: false,
    itemCount: 6,
    updatedAt: "2026-11-03",
  },
  {
    id: "col_orgchem",
    name: "Organic Chemistry",
    description: "Lecture slides, reaction mechanisms and diagrams",
    examDate: null,
    isFavorite: false,
    itemCount: 3,
    updatedAt: "2026-10-30",
  },
  {
    id: "col_react",
    name: "Learning React",
    description: "Videos, articles and notes for self-study",
    examDate: null,
    isFavorite: true,
    itemCount: 3,
    updatedAt: "2026-11-01",
  },
  {
    id: "col_physics",
    name: "Physics I",
    description: "Mechanics and kinematics",
    examDate: "2026-12-18",
    isFavorite: false,
    itemCount: 2,
    updatedAt: "2026-10-28",
  },
];

export const mockItems: MockItem[] = [
  {
    id: "item_1",
    title: "Integration by Parts",
    description: "Lecture 7 summary",
    contentType: "TEXT",
    itemTypeId: "type_note",
    content:
      "## Integration by Parts\n\nUse when the integrand is a product of two functions.\n\nChoose $u$ with **LIATE**: Logarithmic, Inverse trig, Algebraic, Trig, Exponential.\n\nExample: $\\int x e^x \\, dx = x e^x - e^x + C$",
    answer: null,
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["integration", "lecture-7"],
    collectionIds: ["col_calculus", "col_final"],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-11-05",
    createdAt: "2026-10-12",
    updatedAt: "2026-11-04",
  },
  {
    id: "item_2",
    title: "Ratio Test",
    description: null,
    contentType: "TEXT",
    itemTypeId: "type_flashcard",
    content: "When does the ratio test prove a series converges?",
    answer: "When $\\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right| < 1$. If the limit equals 1, the test is inconclusive.",
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["series"],
    collectionIds: ["col_calculus", "col_final"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-11-04",
    createdAt: "2026-10-20",
    updatedAt: "2026-10-20",
  },
  {
    id: "item_3",
    title: "Ubiquitous",
    description: null,
    contentType: "TEXT",
    itemTypeId: "type_flashcard",
    content: "Ubiquitous (adj.)",
    answer: "Present or found everywhere. *Smartphones have become ubiquitous in modern life.*",
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["academic-word-list"],
    collectionIds: ["col_ielts"],
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-11-05",
    createdAt: "2026-10-02",
    updatedAt: "2026-10-02",
  },
  {
    id: "item_4",
    title: "Mitigate",
    description: null,
    contentType: "TEXT",
    itemTypeId: "type_flashcard",
    content: "Mitigate (v.)",
    answer: "To make something less severe or harmful. *Planting trees can mitigate the effects of climate change.*",
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["academic-word-list", "environment"],
    collectionIds: ["col_ielts"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-11-03",
    createdAt: "2026-10-02",
    updatedAt: "2026-10-02",
  },
  {
    id: "item_5",
    title: "Taylor Series",
    description: "Expansion around a point a",
    contentType: "TEXT",
    itemTypeId: "type_formula",
    content: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n",
    answer: null,
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["series"],
    collectionIds: ["col_calculus", "col_final"],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-11-02",
    createdAt: "2026-10-22",
    updatedAt: "2026-10-22",
  },
  {
    id: "item_6",
    title: "Kinematic Equation",
    description: "Constant acceleration",
    contentType: "TEXT",
    itemTypeId: "type_formula",
    content: "v^2 = u^2 + 2as",
    answer: null,
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["mechanics"],
    collectionIds: ["col_physics"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-28",
    createdAt: "2026-09-30",
    updatedAt: "2026-09-30",
  },
  {
    id: "item_7",
    title: "2025 Final, Question 3",
    description: "Past exam question",
    contentType: "TEXT",
    itemTypeId: "type_question",
    content: "Evaluate $\\int_0^1 x \\ln x \\, dx$.",
    answer:
      "Let $u = \\ln x$, $dv = x\\,dx$. Then $\\int_0^1 x \\ln x \\, dx = \\left[\\frac{x^2}{2}\\ln x\\right]_0^1 - \\int_0^1 \\frac{x}{2}\\,dx = 0 - \\frac{1}{4} = -\\frac{1}{4}$",
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["past-paper", "integration"],
    collectionIds: ["col_calculus", "col_final"],
    isFavorite: false,
    isPinned: true,
    lastUsedAt: "2026-11-01",
    createdAt: "2026-10-25",
    updatedAt: "2026-10-25",
  },
  {
    id: "item_8",
    title: "Projectile Range",
    description: null,
    contentType: "TEXT",
    itemTypeId: "type_question",
    content: "A ball is launched at 20 m/s at 30° above the horizontal. How far does it travel on level ground?",
    answer: "$R = \\frac{v^2 \\sin 2\\theta}{g} = \\frac{400 \\cdot \\sin 60°}{9.8} \\approx 35.3$ m",
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["mechanics"],
    collectionIds: ["col_physics"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: null,
    createdAt: "2026-10-27",
    updatedAt: "2026-10-27",
  },
  {
    id: "item_9",
    title: "IELTS Writing Task 2 Band Descriptors",
    description: "Official public band descriptors",
    contentType: "URL",
    itemTypeId: "type_link",
    content: null,
    answer: null,
    url: "https://www.ielts.org/for-test-takers/how-ielts-is-scored",
    fileName: null,
    fileSize: null,
    tags: ["writing"],
    collectionIds: ["col_ielts"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-31",
    createdAt: "2026-10-05",
    updatedAt: "2026-10-05",
  },
  {
    id: "item_10",
    title: "React Docs: Thinking in React",
    description: null,
    contentType: "URL",
    itemTypeId: "type_link",
    content: null,
    answer: null,
    url: "https://react.dev/learn/thinking-in-react",
    fileName: null,
    fileSize: null,
    tags: ["react", "fundamentals"],
    collectionIds: ["col_react"],
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-11-01",
    createdAt: "2026-10-18",
    updatedAt: "2026-10-18",
  },
  {
    id: "item_11",
    title: "Series Convergence Tests Explained",
    description: "Walkthrough of every major test",
    contentType: "URL",
    itemTypeId: "type_video",
    content: null,
    answer: null,
    url: "https://www.youtube.com/watch?v=example-series",
    fileName: null,
    fileSize: null,
    tags: ["series"],
    collectionIds: ["col_calculus"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-29",
    createdAt: "2026-10-21",
    updatedAt: "2026-10-21",
  },
  {
    id: "item_12",
    title: "React Server Components in 20 Minutes",
    description: null,
    contentType: "URL",
    itemTypeId: "type_video",
    content: null,
    answer: null,
    url: "https://www.youtube.com/watch?v=example-rsc",
    fileName: null,
    fileSize: null,
    tags: ["react", "server-components"],
    collectionIds: ["col_react"],
    isFavorite: false,
    isPinned: true,
    lastUsedAt: "2026-11-02",
    createdAt: "2026-10-26",
    updatedAt: "2026-10-26",
  },
  {
    id: "item_13",
    title: "Lecture 5: Nucleophilic Substitution",
    description: "SN1 vs SN2 slides",
    contentType: "FILE",
    itemTypeId: "type_file",
    content: null,
    answer: null,
    url: null,
    fileName: "orgchem-lecture-05.pdf",
    fileSize: 4_812_000,
    tags: ["mechanisms", "lecture-5"],
    collectionIds: ["col_orgchem", "col_final"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-30",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-14",
  },
  {
    id: "item_14",
    title: "Aldol Reaction Whiteboard",
    description: "Photo from Tuesday's tutorial",
    contentType: "FILE",
    itemTypeId: "type_image",
    content: null,
    answer: null,
    url: null,
    fileName: "aldol-whiteboard.jpg",
    fileSize: 2_340_000,
    tags: ["mechanisms"],
    collectionIds: ["col_orgchem"],
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-10-29",
    createdAt: "2026-10-28",
    updatedAt: "2026-10-28",
  },
  {
    id: "item_15",
    title: "useEffect Mental Model",
    description: null,
    contentType: "TEXT",
    itemTypeId: "type_note",
    content:
      "Effects **synchronize** a component with an external system.\n\n- Not for deriving state; compute it during render\n- Always return a cleanup when subscribing\n\n```tsx\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);\n```",
    answer: null,
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["react", "hooks"],
    collectionIds: ["col_react"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-11-03",
    createdAt: "2026-10-19",
    updatedAt: "2026-10-30",
  },
  {
    id: "item_16",
    title: "SN2 Mechanism Notes",
    description: null,
    contentType: "TEXT",
    itemTypeId: "type_note",
    content:
      "## SN2\n\n- One step, concerted\n- Backside attack → inversion of configuration\n- Rate $= k[\\text{substrate}][\\text{nucleophile}]$\n- Favoured by primary substrates and polar aprotic solvents",
    answer: null,
    url: null,
    fileName: null,
    fileSize: null,
    tags: ["mechanisms"],
    collectionIds: ["col_orgchem", "col_final"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-10-30",
    createdAt: "2026-10-15",
    updatedAt: "2026-10-15",
  },
];

// ─────────────────────────────────────────────────────────────
//  SATVA — all editable site content lives here.
//  Replace placeholder names, dates and links with real ones.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "SATVA",
  expansion: "Soft Alliance for Technology, Vision & AI",
  tagline: "Code for future",
  email: "satva.club@example.com", // TODO: replace
  joinUrl: "https://forms.gle/your-form-id", // TODO: replace with Google Form
};

export const socials = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Discord", href: "https://discord.com/" },
];

export const nav = [
  { label: "About", href: "#about" },
  { label: "Pillars", href: "#pillars" },
  { label: "Events", href: "#events" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
];

export const manifesto =
  "We are SATVA — a soft alliance of builders, dreamers and tinkerers. We write code that thinks, design systems that see, and ship ideas that outlive the semester. The future isn't something we wait for. We compile it.";

// Words in the manifesto that get the gradient highlight
export const manifestoHighlights = ["SATVA", "thinks,", "see,", "compile", "it."];

export const pillars = [
  {
    index: "01",
    title: "Technology",
    lead: "Build the stack.",
    body: "From web and mobile to cloud, systems and open source — we learn by shipping real products, together.",
    tags: ["Web & App Dev", "Cloud & DevOps", "Open Source", "Competitive Coding"],
    glyph: "{ }",
  },
  {
    index: "02",
    title: "Vision",
    lead: "Teach machines to see.",
    body: "Computer vision, AR/VR, graphics and creative coding — exploring how software perceives and paints the world.",
    tags: ["Computer Vision", "AR / VR", "Creative Coding", "UI / UX"],
    glyph: "◉",
  },
  {
    index: "03",
    title: "AI",
    lead: "Code that thinks.",
    body: "Machine learning, LLMs and intelligent agents — from first neural nets to research-grade experiments.",
    tags: ["Machine Learning", "LLMs & Agents", "Data Science", "Research"],
    glyph: "∿",
  },
];

export const filmChapters = [
  { ch: "CH.01", title: "Identity", line: "One alliance. Many minds." },
  { ch: "CH.02", title: "Build", line: "Code is our DNA." },
  { ch: "CH.03", title: "Impact", line: "Built for the world." },
];

export const stats = [
  { value: 250, suffix: "+", label: "Active members" },
  { value: 40, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Hackathons hosted" },
  { value: 60, suffix: "+", label: "Workshops & talks" },
];

export const events = [
  {
    date: "15",
    month: "NOV",
    year: "2026",
    title: "Hack the Future 2.0",
    type: "Hackathon",
    place: "Main Auditorium · 36 hrs",
    blurb: "Our flagship 36-hour hackathon. Build anything — AI, web, hardware. Prizes, mentors and lots of caffeine.",
  },
  {
    date: "29",
    month: "NOV",
    year: "2026",
    title: "LLM Agents from Scratch",
    type: "Workshop",
    place: "Lab 3 · 3 hrs",
    blurb: "Hands-on session building tool-using AI agents. Bring a laptop; leave with a working agent.",
  },
  {
    date: "12",
    month: "DEC",
    year: "2026",
    title: "Vision Sprint: See in Code",
    type: "Sprint",
    place: "Innovation Hub · 1 day",
    blurb: "Rapid-fire computer vision challenges — from face meshes to real-time object tracking.",
  },
  {
    date: "18",
    month: "JAN",
    year: "2027",
    title: "Open Source Month Kickoff",
    type: "Community",
    place: "Online + Campus",
    blurb: "Find your first issue, land your first PR. Pair up with maintainers and senior contributors.",
  },
];

export type ProjectCategory = "AI" | "Web" | "Vision" | "Systems";

export const projects: {
  title: string;
  category: ProjectCategory;
  description: string;
  stack: string[];
  hue: number;
}[] = [
  {
    title: "Campus GPT",
    category: "AI",
    description: "A retrieval-augmented assistant that answers anything about campus — timetables, notices, clubs.",
    stack: ["Python", "RAG", "Next.js"],
    hue: 190,
  },
  {
    title: "SignSight",
    category: "Vision",
    description: "Real-time sign-language recognition in the browser, running fully on-device.",
    stack: ["TensorFlow.js", "MediaPipe"],
    hue: 265,
  },
  {
    title: "Pulse",
    category: "Web",
    description: "The club's event platform — registrations, QR check-ins and live leaderboards.",
    stack: ["React", "Node", "Postgres"],
    hue: 85,
  },
  {
    title: "Kernel Garden",
    category: "Systems",
    description: "A tiny teaching OS written in Rust, with a visual scheduler you can play with.",
    stack: ["Rust", "WASM"],
    hue: 330,
  },
  {
    title: "Crop Doctor",
    category: "AI",
    description: "Leaf-image disease detection for local farmers, served over a lightweight PWA.",
    stack: ["PyTorch", "FastAPI", "PWA"],
    hue: 140,
  },
  {
    title: "Spatial Notes",
    category: "Vision",
    description: "Pin sticky notes to the real world with WebXR and share them with friends.",
    stack: ["WebXR", "Three.js"],
    hue: 30,
  },
];

// Placeholder team — replace names, roles and links.
export const team = [
  { name: "Aarav Menon", role: "President", handle: "@aarav" },
  { name: "Diya Thomas", role: "Vice President", handle: "@diya" },
  { name: "Rahul Nair", role: "Tech Lead", handle: "@rahul" },
  { name: "Sneha Pillai", role: "AI / ML Lead", handle: "@sneha" },
  { name: "Arjun Varma", role: "Vision Lead", handle: "@arjun" },
  { name: "Meera Joseph", role: "Design Lead", handle: "@meera" },
  { name: "Kiran Das", role: "Events Lead", handle: "@kiran" },
  { name: "Neha Iyer", role: "Community Lead", handle: "@neha" },
];

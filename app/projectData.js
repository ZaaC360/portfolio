// The projects: shared by the home deck (page.js) and /artworks.
// These six are SAMPLE entries on placeholder Unsplash shots. To make one real: swap src for a
// screenshot (e.g. "/imgs/projects/my-app.png", ~2:1, top of the page shows), rewrite the text,
// add url: "https://..." for a live link, and delete its `sample: true` (that removes the tag).
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=1440&h=700&fit=crop&q=70`;

export const PROJECTS = [
  {
    src: unsplash("1460925895917-afdab827c52f"),
    name: "Paperhand",
    type: "AI product",
    year: "2026",
    platform: "Web",
    stack: ["Next.js", "RAG", "PostgreSQL"],
    does: "An assistant that answers from a firm's own documents, and shows the page it read beside every answer.",
    sample: true,
  },
  {
    src: unsplash("1547658719-da2b51169166"),
    name: "Mise",
    type: "Web app",
    year: "2025",
    platform: "Web",
    stack: ["React", "Node.js", "MongoDB"],
    does: "Ordering for a busy kitchen: guests order from the table and the ticket lands on the pass as they tap.",
    sample: true,
  },
  {
    src: unsplash("1551650975-87deedd944c3"),
    name: "Loop Run",
    type: "Mobile app",
    year: "2025",
    platform: "iOS + Android",
    stack: ["React Native", "TypeScript", "Express"],
    does: "A running tracker that keeps counting with the phone in a pocket and no signal, then syncs when you get home.",
    sample: true,
  },
  {
    src: unsplash("1498050108023-c5249f4df085"),
    name: "Kiln & Co",
    type: "Online store",
    year: "2024",
    platform: "Web",
    stack: ["Next.js", "PostgreSQL", "Payments"],
    does: "A ceramics shop with a cart, payments and a dashboard the owner runs without calling a developer.",
    sample: true,
  },
  {
    src: unsplash("1559028012-481c04fa702d"),
    name: "Halfday",
    type: "Landing page",
    year: "2024",
    platform: "Web",
    stack: ["Next.js", "GSAP"],
    does: "One page for a scheduling tool: a headline, a demo that plays as you scroll, and a sign-up that takes ten seconds.",
    sample: true,
  },
  {
    src: unsplash("1555066931-4365d14bab8c"),
    name: "Tally Room",
    type: "Web app",
    year: "2023",
    platform: "Web",
    stack: ["React", "Express", "MongoDB"],
    does: "A live board for a small sales team: every number on one screen, moving as the deals close.",
    sample: true,
  },
];

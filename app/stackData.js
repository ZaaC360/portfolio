// The stack, bottom layer first. The home tower uses name + role; /stack uses everything.
// The last entry is the yellow slab: the newest layer, crowning the stack.
export const STACK = [
  {
    name: "PostgreSQL",
    role: "SQL database",
    does: "Rows, relations and transactions. The layer that refuses to lose an order or charge a card twice.",
    when: "The data has a shape: users, orders, payments, anything that has to add up.",
    onto: "Node.js, Express, Next.js",
  },
  {
    name: "MongoDB",
    role: "NoSQL database",
    does: "Documents instead of tables. It stores data the way the app already thinks about it.",
    when: "The shape is still moving: content, feeds, catalogues, early products.",
    onto: "Express, Node.js",
  },
  {
    name: "Node.js",
    role: "Runtime",
    does: "JavaScript off the browser. One language from the database call to the button.",
    when: "Always. Everything above this slab runs on it.",
    onto: "Express, TypeScript",
  },
  {
    name: "Express",
    role: "API",
    does: "Routes, auth and middleware: the doors between the data and every screen.",
    when: "Web and mobile have to talk to the same backend.",
    onto: "Node.js, MongoDB, PostgreSQL",
  },
  {
    name: "TypeScript",
    role: "Language",
    does: "Types across the whole build, so mistakes surface in the editor and not in production.",
    when: "The project will outlive its first week. So, every project.",
    onto: "Every slab in the stack",
  },
  {
    name: "React",
    role: "Interface",
    does: "Screens built from components: every state, form and interaction in one place.",
    when: "The interface changes while you look at it: dashboards, forms, live data.",
    onto: "TypeScript, Next.js, GSAP",
  },
  {
    name: "React Native",
    role: "Mobile apps",
    does: "One codebase, real native apps on iOS and Android.",
    when: "You need to be in both app stores without building the product twice.",
    onto: "React, TypeScript, Express",
  },
  {
    name: "Next.js",
    role: "Framework",
    does: "Routing, server rendering and deploys wrapped around React. This site runs on it.",
    when: "It lives on the web: apps, stores, landing pages.",
    onto: "React, Node.js, TypeScript",
  },
  {
    name: "GSAP",
    role: "Motion",
    does: "Timelines, scroll and easing. The reason this page moves the way it does.",
    when: "A product should feel like something, not just work.",
    onto: "React, Next.js",
  },
  {
    name: "Gen AI",
    role: "LLMs · Agents · RAG",
    does: "Language models wired into the product: assistants, agents and answers drawn from your own data.",
    when: "The product should understand, draft or decide, not just store and display.",
    onto: "Node.js, Next.js, your data",
  },
];

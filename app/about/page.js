/* eslint-disable @next/next/no-img-element */
import SiteFooter from "../SiteFooter";
import AboutAnimations from "./AboutAnimations";

export const metadata = { title: "About · Zaac" };

// Placeholder copy: edit these to your real details.
const NUMBERS = [
  { value: "4+", label: "Years writing code" },
  { value: "30+", label: "Projects shipped" },
  { value: "15+", label: "Happy clients" },
];

const SERVICES = [
  { name: "AI products", text: "LLM features, chat assistants and agents wired into your product, with RAG over your own data." },
  { name: "Web apps", text: "Full-stack MERN and Next.js apps, from database to the last pixel." },
  { name: "Mobile apps", text: "Cross-platform iOS and Android apps with React Native." },
  { name: "Landing pages", text: "Fast, animated pages that make a first impression stick." },
  { name: "Online stores", text: "Shops with carts, payments and dashboards you can run yourself." },
];

const TIMELINE = [
  { year: "2025 — now", role: "AI & full-stack developer", text: "Building AI-powered web and mobile products for startups and small brands: LLMs, agents and RAG in production." },
  { year: "2023 — 2025", role: "Full-stack developer", text: "Shipped MERN apps end to end: APIs, auth, dashboards and deploys." },
  { year: "2021 — 2023", role: "Frontend developer", text: "Interfaces in React, with a growing obsession for motion." },
  { year: "2021", role: "First line of code", text: "Started with HTML and CSS, never stopped." },
];

export default function About() {
  return (
    <>
      {/* yellow curtain over the first paint; AboutAnimations collapses it into the headline's dot */}
      <div className="ab-curtain" aria-hidden="true"></div>
      <AboutAnimations />
      {/* plain <a> links: the home page boots its loader and animations on a full load */}
      <header id="top">
        <nav>
          <a href="/" className="logo" aria-label="Home"><img src="/imgs/Z.png" alt="" /></a>
          <div className="menubar">
            <ul className="menulist">
              <li className="menuitem"><a href="/about" aria-current="page">About</a></li>
              <li className="menuitem"><a href="/artworks">Artworks</a></li>
              <li className="menuitem"><a href="/stack">Stack</a></li>
              <li><a href="/lets-talk" className="menuitem talk">Let&apos;s Talk</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="ab">
        <section className="ab-intro">
          <p className="ab-kicker">About</p>
          <h1 className="ab-title">
            Artistic coder.<br />MERN specialist<span className="ab-dot" aria-hidden="true"></span>
          </h1>
          <p className="ab-bio">
            I&apos;m Zaac, a developer who designs while building. I make web and mobile apps with MERN,
            Next.js and React Native, and I build generative AI into them: LLM features, agents and RAG
            that ship, not demos. I care as much about how a product moves as how it works.
          </p>
        </section>

        <section className="ab-numbers" aria-label="In numbers">
          {NUMBERS.map((n) => (
            <div className="ab-number" key={n.label}>
              <p className="ab-number-value">{n.value}</p>
              <p className="ab-number-label">{n.label}</p>
            </div>
          ))}
        </section>

        <section className="ab-block">
          <h2 className="ab-heading">What I do</h2>
          <ol className="ab-services">
            {SERVICES.map((s, i) => (
              <li key={s.name}>
                <span className="ab-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ab-block">
          <h2 className="ab-heading">Experience</h2>
          {/* the track: a grey rail, and a yellow line the scroll draws down it */}
          <div className="ab-track">
            <span className="ab-progress" aria-hidden="true"></span>
            <ol className="ab-timeline">
              {TIMELINE.map((t) => (
                <li key={t.year}>
                  <span className="ab-year">{t.year}</span>
                  <div>
                    <h3>{t.role}</h3>
                    <p>{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

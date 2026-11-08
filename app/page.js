/* eslint-disable @next/next/no-img-element */
import Animations from "./Animations";
import ContactForm from "./ContactForm";
import SiteFooter from "./SiteFooter";
import TumbleDeckShowcase from "../components/ui/tumble-deck-showcase";

// Placeholder Unsplash shots: swap each src for a screenshot of your project
// (e.g. "/imgs/projects/my-app.png", ~2:1, top of the page shows) and set alt to its name.
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=1440&h=700&fit=crop&q=70`;
const PROJECTS = [
  { src: unsplash("1460925895917-afdab827c52f"), alt: "Project one" },
  { src: unsplash("1547658719-da2b51169166"), alt: "Project two" },
  { src: unsplash("1551650975-87deedd944c3"), alt: "Project three" },
  { src: unsplash("1498050108023-c5249f4df085"), alt: "Project four" },
  { src: unsplash("1559028012-481c04fa702d"), alt: "Project five" },
  { src: unsplash("1555066931-4365d14bab8c"), alt: "Project six" },
];

const STACK = [
  { name: "PostgreSQL", role: "SQL database" },
  { name: "MongoDB", role: "NoSQL database" },
  { name: "Node.js", role: "Runtime" },
  { name: "Express", role: "API" },
  { name: "TypeScript", role: "Language" },
  { name: "React", role: "Interface" },
  { name: "React Native", role: "Mobile apps" },
  { name: "Next.js", role: "Framework" },
  { name: "GSAP", role: "Motion" },
];

export default function Home() {
  return (
    <>
      {/* Loader: in the HTML so it covers the page from the first paint. A filling counter
          and a live build log run until fonts, hero photo and animations are ready
          (Animations.js); then its dot floods the screen yellow and the whole thing collapses
          into the yellow dot after CREATIVE in the hero. */}
      <div className="loader" aria-hidden="true">
        <div className="loader-mid">
          {/* the timer: an outlined 100 that fills with solid white from the bottom */}
          <div className="loader-num">
            <span className="fill-num">
              100
              <span className="fill-solid">100</span>
            </span>
            <span className="loader-dot"></span>
          </div>
          <p className="loader-tag">
            Great things take time <span className="loader-pct">000%</span>
          </p>
        </div>
        <ul className="loader-log"></ul>
      </div>
      <header id="top">
        <nav>
          <div className="logo"><img src="/imgs/Z.png" alt="" /></div>
          <div className="menubar">
            <ul className="menulist">
              <li className="menuitem"><a href="/about">About</a></li>
              <li className="menuitem"><a href="#artworks">Artworks</a></li>
              <li className="menuitem"><a href="#stack">Stack</a></li>
              <li><a href="#contact" className="menuitem talk">Let&apos;s Talk</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="scene">
          <div className="layer plate"></div>
          <h1 className="layer box text-upper" aria-label="Creative Developer"><span className="stretch">Creative</span><span className="layer-dot"></span></h1>
          <div className="layer box layer-photo">
            <img src="/imgs/me-cutout.png" alt="me" />
          </div>
          <p className="layer box text-lower" aria-hidden="true">
            <span className="dev-dark"><span className="stretch">Developer</span></span>
            <span className="dev-light"><span className="stretch">Developer</span></span>
          </p>
        </div>
      </section>

      <section className="about" id="about">
        <h1> Artistic coder. MERN Specialist.</h1>
      </section>

      <section className="artwork" id="artworks">
        <p className="stack-caption reveal">Selected Work <span>Things I&apos;ve designed and built.</span></p>
        <TumbleDeckShowcase cards={PROJECTS} height="100vh" clickOnly ariaLabel="Selected projects" />
        <span className="deck-hint" aria-hidden="true"></span>
      </section>

      {/* Exploded-view tower: bottom layer first. Edit STACK to change the tech. */}
      <section className="stack" id="stack">
        <p className="stack-caption reveal">The Stack <span>What I build with, layer by layer.</span></p>
        <p className="stack-bg" aria-hidden="true">Stack</p>
        <div className="tower-wrap">
          <ol className="tower">
            {STACK.map((t, i) => (
              <li className="slab" key={t.name} style={{ "--i": i }}>
                <span className="slab-name">{t.name}</span>
                <span className="slab-role">{t.role}</span>
                <span className="slab-spine" aria-hidden="true">{t.name}</span>
                <span className="slab-label" aria-hidden="true">{String(i + 1).padStart(2, "0")} {t.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The brief: a fill-in-the-blanks letter */}
      <section className="letsTalk" id="contact">
        <h2 className="talk-kicker reveal">Let&apos;s talk · Fill in the blanks</h2>
        <ContactForm />
      </section>

      <SiteFooter />
      {/* key: re-run the animations when the stack list changes (hot reload adds slabs GSAP never saw) */}
      <Animations key={STACK.map((t) => t.name).join()} />
    </>
  );
}

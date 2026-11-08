/* eslint-disable @next/next/no-img-element */
import Animations from "./Animations";
import ContactForm from "./ContactForm";
import AsciiFooter from "./AsciiFooter";
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
              <li className="menuitem"><a href="#about">About</a></li>
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

      {/* The brief: a fill-in-the-blanks letter over a drifting "let's talk" backdrop */}
      <section className="letsTalk" id="contact">
        <div className="talk-marquee" aria-hidden="true">
          <span>Let&apos;s talk — Let&apos;s talk — Let&apos;s talk — </span>
          <span>Let&apos;s talk — Let&apos;s talk — Let&apos;s talk — </span>
        </div>
        <h2 className="talk-kicker reveal">Let&apos;s talk · Fill in the blanks</h2>
        <ContactForm />
      </section>

      {/* The hands reaching for each other = connection: the footer's one idea */}
      <footer className="site-footer">
        <div className="footer-art">
          <AsciiFooter />
          {/* the spark in the gap between the fingertips: the connection, and a way to make one */}
          <a href="#contact" className="footer-spark" aria-label="Let's connect: go to the contact form">
            <span className="footer-spark-dot" aria-hidden="true"></span>
            <span className="footer-spark-label">let&apos;s connect</span>
          </a>
        </div>
        <p className="footer-art-line reveal">every great product starts with a connection</p>

        <div className="footer-cta">
          <h2 className="footer-title reveal">Got an idea?<br />Let&apos;s make it real.</h2>
          <a href="#contact" className="footer-button">Start a project →</a>
        </div>

        <div className="footer-cols">
          <nav className="footer-col reveal" aria-label="Footer">
            <p className="footer-label">Navigate</p>
            <div className="footer-row">
              <a href="#about" className="footer-link">About</a>
              <a href="#artworks" className="footer-link">Artworks</a>
              <a href="#stack" className="footer-link">Stack</a>
              <a href="#contact" className="footer-link">Let&apos;s Talk</a>
              {/* phones only: Elsewhere is hidden there, so GitHub joins this row */}
              <a href="https://github.com/ZaaC360" className="footer-link footer-phone-only footer-github" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              </a>
            </div>
          </nav>
          <div className="footer-col reveal">
            <p className="footer-label">Elsewhere</p>
            <a href="https://github.com/ZaaC360" className="footer-link" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <div className="footer-col reveal">
            <p className="footer-label">Currently</p>
            <p className="footer-text">Building web &amp; mobile apps with MERN, Next.js and React Native.</p>
          </div>
        </div>

        <div className="footer-bar reveal">
          <span>© 2026 ZAAC — all bytes reserved</span>
          <span className="footer-sig">0x5A414143 · EOF<span className="footer-cursor" aria-hidden="true"></span></span>
          <a href="#top" className="footer-link">Back to top ↑</a>
        </div>
      </footer>
      {/* key: re-run the animations when the stack list changes (hot reload adds slabs GSAP never saw) */}
      <Animations key={STACK.map((t) => t.name).join()} />
    </>
  );
}

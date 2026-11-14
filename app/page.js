/* eslint-disable @next/next/no-img-element */
import Animations from "./Animations";
import ContactForm from "./ContactForm";
import SiteFooter from "./SiteFooter";
import { STACK } from "./stackData"; // shared with /stack
import { PROJECTS } from "./projectData"; // shared with /artworks
import TumbleDeckShowcase from "../components/ui/tumble-deck-showcase";

// the deck only needs the picture and its name; the full entries are on /artworks
const DECK = PROJECTS.map((p) => ({ src: p.src, alt: p.name }));

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
              <li className="menuitem"><a href="/artworks">Artworks</a></li>
              <li className="menuitem"><a href="/stack">Stack</a></li>
              <li><a href="/lets-talk" className="menuitem talk">Let&apos;s Talk</a></li>
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
        <TumbleDeckShowcase cards={DECK} height="100vh" clickOnly ariaLabel="Selected projects" />
        <span className="deck-hint" aria-hidden="true"></span>
      </section>

      {/* Exploded-view tower: bottom layer first. Edit STACK (stackData.js) to change the tech. */}
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

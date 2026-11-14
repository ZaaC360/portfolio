/* eslint-disable @next/next/no-img-element */
import SiteFooter from "../SiteFooter";
import { PROJECTS } from "../projectData";
import ArtworksAnimations from "./ArtworksAnimations";

export const metadata = { title: "Artworks · Zaac" };

const no = (i) => String(i + 1).padStart(2, "0");
const COUNT = no(PROJECTS.length - 1);
// while any entry is a sample the page says so up front; it only claims the work once it is real
const SAMPLES = PROJECTS.some((p) => p.sample);
// the line never shows a gap: enough copies of the projects to outrun the widest screen (18 cards)
const LINE = Array.from({ length: Math.ceil(18 / PROJECTS.length) }, () => PROJECTS).flat();

// The home deck, standing and on the move: a line of overlapped cards drifts across the first
// screen (pure CSS), and the one under the pointer rises out of it. Below, one plate per project.
// Without JS (or with reduced motion) it is a plain page: the line stands still and nothing is
// hidden. ArtworksAnimations reveals each plate as the scroll reaches it.
export default function Artworks() {
  return (
    <>
      {/* yellow curtain over the first paint (same as /about); ArtworksAnimations collapses it into the title's dot */}
      <div className="ab-curtain" aria-hidden="true"></div>
      <ArtworksAnimations />
      <header id="top">
        <nav>
          <a href="/" className="logo" aria-label="Home"><img src="/imgs/Z.png" alt="" /></a>
          <div className="menubar">
            <ul className="menulist">
              <li className="menuitem"><a href="/about">About</a></li>
              <li className="menuitem"><a href="/artworks" aria-current="page">Artworks</a></li>
              <li className="menuitem"><a href="/stack">Stack</a></li>
              <li><a href="/lets-talk" className="menuitem talk">Let&apos;s Talk</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="aw">
        <section className="aw-top">
          <h1 className="aw-title">Artworks<span className="ab-dot" aria-hidden="true"></span></h1>
          <div className="aw-side">
            <p className="aw-lede">
              {PROJECTS.length} {SAMPLES ? "sample builds" : "things I designed and built"}, filing past.
            </p>
            <p className="aw-hint">Pick one, or scroll ↓</p>
          </div>
          {/* each card jumps to its plate; only the first copy of each is read out and tabbable */}
          <nav className="aw-file" aria-label="Projects">
            <ol className="aw-row" style={{ "--n": LINE.length }}>
              {LINE.map((p, k) => {
                const i = k % PROJECTS.length;
                const copy = k >= PROJECTS.length;
                return (
                  <li className="aw-tile" key={k} style={{ "--i": k }} aria-hidden={copy || undefined}>
                    <a href={`#work-${no(i)}`} tabIndex={copy ? -1 : undefined}>
                      <span className="aw-tile-card"><img src={p.src} alt="" /></span>
                      <span className="aw-tile-label"><span>{no(i)}</span><b>{p.name}</b></span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </section>

        <ol className="aw-plates">
          {PROJECTS.map((p, i) => (
            <li className="aw-plate" key={p.name}>
              {/* the cards in the line link here: the name lands near the top, the card already standing */}
              <h2 className="aw-name" id={`work-${no(i)}`}>{p.name}</h2>
              <div className="aw-body">
                <div className="aw-stage">
                  <div className="aw-card"><img src={p.src} alt={p.sample ? "" : `${p.name} screenshot`} loading="lazy" /></div>
                </div>
                <div className="aw-info">
                  <p className="aw-does">{p.does}</p>
                  <dl className="aw-facts">
                    <div><dt>Year</dt><dd>{p.year}</dd></div>
                    <div><dt>Platform</dt><dd>{p.platform}</dd></div>
                    <div><dt>Stack</dt><dd>{p.stack.join(" · ")}</dd></div>
                  </dl>
                  {p.url && (
                    <a href={p.url} className="aw-visit" target="_blank" rel="noreferrer">Visit {p.name} ↗</a>
                  )}
                </div>
              </div>
              <p className="aw-caption">
                <span>{no(i)} / {COUNT}</span>
                <span>{p.type}{p.sample && " · Sample"}</span>
              </p>
            </li>
          ))}

          {/* the close: an empty slot on the floor, numbered one past the last card */}
          <li className="aw-plate aw-open">
            <h2 className="aw-name">Yours<span className="ab-dot" aria-hidden="true"></span></h2>
            <div className="aw-body">
              <div className="aw-stage">
                <a href="/lets-talk" className="aw-slot">Put yours here →</a>
              </div>
              <div className="aw-info">
                <p className="aw-does">
                  This spot on the floor is empty. Tell me what goes here.
                </p>
              </div>
            </div>
            <p className="aw-caption">
              <span>{no(PROJECTS.length)}</span>
              <span>Open slot</span>
            </p>
          </li>
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}

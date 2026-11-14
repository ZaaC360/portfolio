/* eslint-disable @next/next/no-img-element */
import SiteFooter from "../SiteFooter";
import { STACK } from "../stackData";
import StackAnimations from "./StackAnimations";

export const metadata = { title: "Stack · Zaac" };

const no = (i) => String(i + 1).padStart(2, "0");
const TOP_DOWN = STACK.map((t, i) => ({ ...t, i })).reverse();

// The home tower, redrawn as an assembly drawing. Without JS (or with reduced motion) it is a
// plain page: the drawing, the parts list, then every part's notes. StackAnimations pins the
// sheet and walks the parts one by one instead.
export default function Stack() {
  return (
    <>
      {/* yellow curtain over the first paint (same as /about); StackAnimations collapses it into the title's dot */}
      <div className="ab-curtain" aria-hidden="true"></div>
      <StackAnimations />
      <div className="sk-page">
        {/* the stage is what gets pinned: the nav stays on screen for the whole walk */}
        <div className="sk-stage">
          <header id="top">
            <nav>
              <a href="/" className="logo" aria-label="Home"><img src="/imgs/Z.png" alt="" /></a>
              <div className="menubar">
                <ul className="menulist">
                  <li className="menuitem"><a href="/about">About</a></li>
                  <li className="menuitem"><a href="/artworks">Artworks</a></li>
                  <li className="menuitem"><a href="/stack" aria-current="page">Stack</a></li>
                  <li><a href="/lets-talk" className="menuitem talk">Let&apos;s Talk</a></li>
                </ul>
              </div>
            </nav>
          </header>

          <main className="sk">
            <div className="sk-sheet">
              {/* drafting rulers along the frame */}
              <p className="sk-ruler sk-ruler-x" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((z) => <span key={z}>{z}</span>)}
              </p>
              <p className="sk-ruler sk-ruler-y" aria-hidden="true">
                {["A", "B", "C", "D"].map((z) => <span key={z}>{z}</span>)}
              </p>

              <section className="sk-card sk-intro is-on">
                <h1 className="sk-fit">Stack<span className="ab-dot" aria-hidden="true"></span></h1>
                <p className="sk-does">
                  {STACK.length} parts, drawn apart so you can see how each one carries the next.
                </p>
                <p className="sk-hint">Scroll to pull each part ↓</p>
              </section>

              {/* the drawing repeats the list beside it, so it is hidden from screen readers */}
              <div className="sk-drawing" aria-hidden="true" style={{ "--n": STACK.length }}>
                <div className="tower-wrap">
                  <ol className="tower">
                    {STACK.map((t, i) => (
                      <li className="sk-slot" key={t.name} style={{ "--i": i }}>
                        <div className="slab">
                          <span className="slab-name">{t.name}</span>
                          <span className="slab-role">{t.role}</span>
                          <span className="slab-spine">{t.name}</span>
                        </div>
                        <span className="sk-balloon"><b>{no(i)}</b></span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <aside className="sk-side">
                <nav aria-label="Parts list">
                  <ol className="sk-parts" reversed>
                    {TOP_DOWN.map((t) => (
                      <li key={t.name}>
                        <a href={`#part-${no(t.i)}`}>
                          <span className="sk-no">{no(t.i)}</span>
                          <b>{t.name}</b>
                          <span className="sk-role">{t.role}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="sk-block">
                  <p className="sk-block-title">Zaac · Full stack assembly</p>
                  <p><span>Drawn by</span>Zaac</p>
                  <p><span>Parts</span>{STACK.length}</p>
                  <p><span>View</span><b className="sk-view">Exploded</b></p>
                </div>
              </aside>

              <ol className="sk-details">
                {STACK.map((t, i) => (
                  <li className="sk-card" id={`part-${no(i)}`} key={t.name}>
                    <h2 className="sk-fit">{t.name}</h2>
                    <p className="sk-spec">Part {no(i)} of {STACK.length} · {t.role}</p>
                    <p className="sk-does">{t.does}</p>
                    <dl className="sk-facts">
                      <div>
                        <dt>I reach for it when</dt>
                        <dd>{t.when}</dd>
                      </div>
                      <div>
                        <dt>Bolts onto</dt>
                        <dd>{t.onto}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ol>

              {/* the last stop of the walk: the tower closes back up */}
              <section className="sk-card sk-outro">
                <h2 className="sk-fit">Assembled<span className="ab-dot" aria-hidden="true"></span></h2>
                <p className="sk-does">
                  {STACK.length} parts, one product. Keep scrolling and tell me what yours needs.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

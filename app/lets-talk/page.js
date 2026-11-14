/* eslint-disable @next/next/no-img-element */
import Gap from "./Gap";
import TalkAnimations from "./TalkAnimations";

export const metadata = { title: "Let's Talk · Zaac" };

// No site footer here: its art is these same hands, and this page is them.
export default function LetsTalk() {
  return (
    <>
      {/* yellow curtain over the first paint (same as /about); TalkAnimations collapses it into the spark */}
      <div className="ab-curtain" aria-hidden="true"></div>
      <TalkAnimations />
      <header id="top" className="is-dark">
        <nav>
          <a href="/" className="logo" aria-label="Home"><img src="/imgs/Z.png" alt="" /></a>
          <div className="menubar">
            <ul className="menulist">
              <li className="menuitem"><a href="/about">About</a></li>
              <li className="menuitem"><a href="/artworks">Artworks</a></li>
              <li className="menuitem"><a href="/stack">Stack</a></li>
              <li><a href="/lets-talk" className="menuitem talk" aria-current="page">Let&apos;s Talk</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="gap-page">
        <section className="gap-top">
          <h1 className="gap-title">Let&apos;s close the gap</h1>
          <div className="gap-aside">
            <p className="gap-lede">Four questions. Every answer brings us closer.</p>
            <ul className="gap-status">
              <li><span className="gap-pulse" aria-hidden="true"></span>Open to new projects</li>
              <li>Remote · any timezone</li>
              <li>
                Code first? <a href="https://github.com/ZaaC360" target="_blank" rel="noreferrer">GitHub ↗</a>
              </li>
            </ul>
          </div>
        </section>
        <Gap />
      </main>
    </>
  );
}

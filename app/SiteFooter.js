import AsciiFooter from "./AsciiFooter";

// The site-wide footer. The hands reaching for each other = connection: the footer's one idea.
// Links are root-relative (/#contact) so they work from every page; Lenis still glides on home.
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-art">
        <AsciiFooter />
        {/* the spark in the gap between the fingertips: the connection, and a way to make one */}
        <a href="/#contact" className="footer-spark" aria-label="Let's connect: go to the contact form">
          <span className="footer-spark-dot" aria-hidden="true"></span>
          <span className="footer-spark-label">let&apos;s connect</span>
        </a>
      </div>
      <p className="footer-art-line reveal">every great product starts with a connection</p>

      <div className="footer-cta">
        <h2 className="footer-title reveal">Got an idea?<br />Let&apos;s make it real.</h2>
        <a href="/#contact" className="footer-button">Start a project →</a>
      </div>

      <div className="footer-cols">
        <nav className="footer-col reveal" aria-label="Footer">
          <p className="footer-label">Navigate</p>
          <div className="footer-row">
            <a href="/about" className="footer-link">About</a>
            <a href="/#artworks" className="footer-link">Artworks</a>
            <a href="/#stack" className="footer-link">Stack</a>
            <a href="/#contact" className="footer-link">Let&apos;s Talk</a>
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
  );
}

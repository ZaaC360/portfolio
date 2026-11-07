/* eslint-disable @next/next/no-img-element */
import Animations from "./Animations";
import ContactForm from "./ContactForm";

const talkButton = {
  color: "white",
  backgroundColor: "black",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  padding: "12px 18px",
  lineHeight: 1,
};

export default function Home() {
  return (
    <>
      <header>
        <nav>
          <div className="logo"><img src="/imgs/Z.png" alt="" /></div>
          <div className="menubar">
            <ul className="menulist">
              <li className="menuitem"><a href="#about">About</a></li>
              <li className="menuitem"><a href="#artworks">Artworks</a></li>
              <li className="menuitem"><a href="#stack">Stack</a></li>
              <li><a href="#contact" className="menuitem" style={talkButton}>Let&apos;s Talk</a></li>
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

      <section className="artwork" id="artworks"></section>

      {/* placeholder until the Stack section has content */}
      <section className="stack" id="stack"></section>

      <section className="letsTalk" id="contact">
        <h1>let&apos;s Talk</h1>
        <ContactForm />
      </section>

      <footer></footer>
      <Animations />
    </>
  );
}

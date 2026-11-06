/* eslint-disable @next/next/no-img-element */
import Animations from "./Animations";

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
              <li className="menuitem">About</li>
              <li className="menuitem">Artworks</li>
              <li className="menuitem">Stack</li>
              <li><button className="menuitem" style={talkButton}>Let&apos;s Talk</button></li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="hero">
        <img src="/imgs/Untitled design (8).png" alt="me" />
      </section>

      <section className="about">
        <h1> Artistic coder. MERN Specialist.</h1>
      </section>

      <section className="artwork"></section>

      <section className="letsTalk">
        <h1>let&apos;s Talk</h1>
        <form action="" method="get" className="form">
          <div className="namediv">
            <label htmlFor="nameinput">Your Name </label><br />
            <input type="text" name="name" id="nameinput" required />
          </div>
          <div className="maildiv">
            <label htmlFor="emailinput">Your Mail </label><br />
            <input type="email" name="email" id="emailinput" required />
          </div>
          <div className="serdiv">
            <label htmlFor="workinput">Work </label><br />
            <input type="text" name="work" id="workinput" required />
          </div>
          <div className="workdesdiv">
            <label htmlFor="workdesinput">Work Description </label><br />
            <input type="text" name="workdescription" id="workdesinput" required />
          </div>
          <div className="submitdiv">
            <input type="submit" value="SUBMIT!" />
          </div>
        </form>
      </section>

      <footer></footer>
      <Animations />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

// Formspree form id (formspree.io -> New form). Set NEXT_PUBLIC_FORMSPREE_ID in .env.local.
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const MESSAGES = {
  sending: "Sending…",
  sent: "Sent. Talk soon.",
  error: "Something went wrong. Please try again.",
  unconfigured: "This form isn't connected yet. Your message was not sent.",
};

// Each blank is exactly as wide as its text (or placeholder), measured in its own font:
// `ch` overshoots badly in this condensed face.
let measure;
const fit = (input) => {
  measure ??= document.createElement("canvas").getContext("2d");
  const cs = getComputedStyle(input);
  measure.font = cs.font;
  const text = (input.value || input.placeholder).toUpperCase(); // shown uppercase via CSS
  // slack scales with the font: the blank's em-based padding grows with it (a fixed 16px
  // clipped the last letter on big screens)
  input.style.width = `${Math.ceil(measure.measureText(text).width + parseFloat(cs.fontSize) * 0.3)}px`;
};

// Desktop: the sentence is exactly two lines (.brief-row, no wrapping). Size the blanks,
// then shrink any line that is wider than the box, on its own, and re-size its blanks at
// the new size. Phones wrap naturally instead.
const fitSentence = (form) => {
  if (!form) return;
  const line = form.querySelector(".brief-line");
  const rows = [...line.querySelectorAll(".brief-row")];
  rows.forEach((r) => (r.style.fontSize = ""));
  form.querySelectorAll(".brief-blank").forEach(fit);
  if (innerWidth < 768) return;
  rows.forEach((r) => {
    if (r.scrollWidth <= line.clientWidth) return;
    r.style.fontSize = `${(parseFloat(getComputedStyle(r).fontSize) * line.clientWidth) / r.scrollWidth * 0.98}px`;
    r.querySelectorAll(".brief-blank").forEach(fit);
  });
};

// One blank in the sentence. aria-label stands in for the visible label the sentence replaces.
function Blank({ placeholder, ...props }) {
  return (
    <input
      className="brief-blank"
      placeholder={placeholder}
      style={{ width: `${placeholder.length}ch` }} // until fonts load and fit() measures
      required
      {...props}
    />
  );
}

/*
 * "The brief": the contact form as one big fill-in-the-blanks sentence. Fields: name,
 * work, workdescription, email, phone; sent to Formspree as before.
 */
export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  // size the sentence once the title font is in, and on resize (the font size is fluid)
  useEffect(() => {
    const fitAll = () => fitSentence(formRef.current);
    document.fonts.ready.then(fitAll);
    addEventListener("resize", fitAll);
    return () => removeEventListener("resize", fitAll);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    // Never pretend to send: without a form id, keep what they typed and say so.
    if (!FORM_ID) return setStatus("unconfigured");
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Formspree ${res.status}`);
      form.reset(); // clear only once the message is safely delivered
      fitSentence(form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="brief" onSubmit={onSubmit} onInput={(e) => fitSentence(e.currentTarget)} ref={formRef}>
      <p className="brief-line reveal">
        <span className="brief-row">
          Hi Zaac, I&apos;m <Blank name="name" aria-label="Your name" placeholder="your name" autoComplete="name" />{" "}
          and I need <Blank name="work" aria-label="What you need" placeholder="a website" list="brief-work" />{" "}
          that{" "}
          <span className="brief-keep">
            <Blank name="workdescription" aria-label="What it should do" placeholder="sells my coffee" />.
          </span>
        </span>{" "}
        <span className="brief-row">
          Reach me at{" "}
        <Blank type="email" name="email" aria-label="Your email" placeholder="you@mail.com" autoComplete="email" /> and{" "}
        <span className="brief-keep">
          <Blank
            type="tel"
            name="phone"
            aria-label="Your phone number"
            placeholder="your number"
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+ \-\(\)]{7,}"
            title="At least 7 digits; + - ( ) and spaces are fine"
          />
          .
        </span>
        </span>
      </p>
      <datalist id="brief-work">
        <option value="a website" />
        <option value="a web app" />
        <option value="a mobile app" />
        <option value="a landing page" />
        <option value="an online store" />
      </datalist>
      <div className="brief-actions">
        <button type="submit" className="brief-send" disabled={status === "sending"}>
          Send it <span aria-hidden="true">→</span>
        </button>
        <p className="brief-status" role="status" aria-live="polite">
          {MESSAGES[status] ?? ""}
        </p>
      </div>
    </form>
  );
}

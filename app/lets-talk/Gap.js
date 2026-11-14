"use client";

import { useEffect, useRef, useState } from "react";
import { MESSAGES, sendBrief } from "../ContactForm";
import GapHands from "./GapHands";

// Same values as the home form's suggestions, plus AI (the About page's first service).
const NEEDS = [
  ["Website", "a website"],
  ["Web app", "a web app"],
  ["Mobile app", "a mobile app"],
  ["Landing page", "a landing page"],
  ["Online store", "an online store"],
  ["AI feature", "an AI feature"],
];

const QUESTIONS = ["Who's asking?", "What are we building?", "What should it do?", "Where do I reply?"];
const EMPTY = { name: "", work: "", workdescription: "", email: "", phone: "" };
const METER = ["Four answers apart", "Three answers apart", "Two answers apart", "One answer apart", "One click apart"];

/*
 * Close the gap: one question at a time. Each answer pulls the visitor's hand toward Zaac's;
 * a delivered brief makes them touch and the spark floods the screen. Same Formspree fields
 * as the home form: name, work, workdescription, email, phone (optional here).
 */
export default function Gap() {
  const [v, setV] = useState(EMPTY);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [flood, setFlood] = useState(null); // the spark's centre once it floods
  const formRef = useRef(null);
  const moved = useRef(false); // focus follows the step only after the visitor has acted

  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }));
  const done = [v.name.trim(), v.work.trim(), v.workdescription.trim(), /\S+@\S+\.\S+/.test(v.email)];
  const count = done.filter(Boolean).length;
  const sent = status === "sent";
  const last = step === QUESTIONS.length - 1;

  useEffect(() => {
    if (moved.current) formRef.current?.querySelector(`[data-step="${step}"] input`)?.focus();
  }, [step]);

  // the hands meet first (GapHands, 0.7s), then the spark floods from where they touch
  useEffect(() => {
    if (!sent) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = document.querySelector(".gap-spark").getBoundingClientRect();
    const t = setTimeout(() => setFlood({ x: r.left + r.width / 2, y: r.top + r.height / 2 }), reduce ? 0 : 750);
    return () => clearTimeout(t);
  }, [sent]);

  // the first field (in or before step `upto`) the browser calls invalid, or -1
  const firstInvalid = (upto) => {
    for (let i = 0; i <= upto; i++) {
      const bad = [...formRef.current.querySelectorAll(`[data-step="${i}"] input`)].find((el) => !el.checkValidity());
      if (bad) return { i, bad };
    }
    return null;
  };

  const go = (to) => {
    moved.current = true;
    setStatus("idle");
    setStep(to);
  };

  async function onSubmit(e) {
    e.preventDefault();
    const miss = firstInvalid(last ? QUESTIONS.length - 1 : step);
    if (miss) {
      if (miss.i !== step) go(miss.i);
      setTimeout(() => miss.bad.reportValidity());
      return;
    }
    if (!last) return go(step + 1);
    setStatus("sending");
    setStatus(await sendBrief(e.currentTarget));
  }

  function again() {
    setV(EMPTY);
    setFlood(null);
    go(0);
  }

  return (
    <>
      <GapHands progress={count / 4} touched={sent} label={sent ? "Connected" : METER[count]} />

      <form className="gap-form" ref={formRef} onSubmit={onSubmit} noValidate>
        {QUESTIONS.map((q, i) => (
          <div className="gap-step" data-step={i} key={q} hidden={i !== step}>
            <label className="gap-q" htmlFor={`gap-${i}`}>
              <span className="gap-count">
                {String(i + 1).padStart(2, "0")} / 04
              </span>
              <span className="gap-q-text">{q}</span>
            </label>

            {i === 0 && (
              <input id="gap-0" className="gap-input" name="name" placeholder="Your name" autoComplete="name" required value={v.name} onChange={set("name")} />
            )}

            {i === 1 && (
              <>
                <div className="gap-chips" role="group" aria-label="Quick picks">
                  {NEEDS.map(([label, value]) => (
                    <button
                      type="button"
                      key={value}
                      className="gap-chip"
                      aria-pressed={v.work === value}
                      onClick={() => setV((o) => ({ ...o, work: value }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input id="gap-1" className="gap-input" name="work" placeholder="Or say it your way" required value={v.work} onChange={set("work")} />
              </>
            )}

            {i === 2 && (
              <input id="gap-2" className="gap-input" name="workdescription" placeholder="Sells my coffee" required value={v.workdescription} onChange={set("workdescription")} />
            )}

            {i === 3 && (
              <div className="gap-pair">
                <input id="gap-3" className="gap-input" type="email" name="email" placeholder="you@mail.com" autoComplete="email" required value={v.email} onChange={set("email")} />
                <input
                  className="gap-input"
                  type="tel"
                  name="phone"
                  aria-label="Phone number (optional)"
                  placeholder="Phone (optional)"
                  autoComplete="tel"
                  inputMode="tel"
                  pattern="[0-9+ \-\(\)]{7,}"
                  title="At least 7 digits; + - ( ) and spaces are fine"
                  value={v.phone}
                  onChange={set("phone")}
                />
              </div>
            )}
          </div>
        ))}

        <div className="gap-controls">
          <button type="button" className="gap-back" onClick={() => go(step - 1)} disabled={step === 0}>
            ← Back
          </button>
          <button type="submit" className="brief-send" disabled={status === "sending"}>
            {last ? "Close the gap" : "Next"} <span aria-hidden="true">→</span>
          </button>
        </div>

        <p className="brief-status gap-status" role="status" aria-live="polite">
          {sent ? "" : MESSAGES[status] ?? ""}
        </p>
      </form>

      {/* delivered: the spark floods the screen yellow from between the fingertips */}
      {flood && (
        <div className="gap-flood" style={{ "--fx": `${flood.x}px`, "--fy": `${flood.y}px` }} role="alert">
          <p className="gap-flood-title">
            Sent<span className="gap-flood-dot" aria-hidden="true"></span>
          </p>
          <p className="gap-flood-text">Gap closed. I&apos;ll read your brief and get back to you.</p>
          <div className="gap-flood-actions">
            <a href="/" className="gap-home">Back home</a>
            <button type="button" className="gap-back gap-again" onClick={again}>
              Send another brief
            </button>
          </div>
        </div>
      )}
    </>
  );
}

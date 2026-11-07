"use client";

import { useState } from "react";

// Formspree form id (formspree.io -> New form). Set NEXT_PUBLIC_FORMSPREE_ID in .env.local.
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const MESSAGES = {
  sending: "Sending…",
  sent: "Thanks! I'll get back to you soon.",
  error: "Something went wrong. Please try again.",
  unconfigured: "This form isn't connected yet. Your message was not sent.",
};

export default function ContactForm() {
  const [status, setStatus] = useState("idle");

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
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
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
        <input type="submit" value="SUBMIT!" disabled={status === "sending"} />
      </div>
      <p role="status" aria-live="polite">{MESSAGES[status] ?? ""}</p>
    </form>
  );
}

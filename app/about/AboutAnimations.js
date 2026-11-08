"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);

const DIGITS = "0123456789";

// Renders nothing: drives every animation on /about.
export default function AboutAnimations() {
  useEffect(() => {
    const curtain = document.querySelector(".ab-curtain");
    // the curtain's CSS fallback hides it on its own if this never runs; from here JS owns it
    if (curtain) curtain.style.animation = "none";

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (curtain) curtain.style.display = "none";
      return;
    }

    CustomEase.create("ab-snap", "0.16, 1, 0.3, 1");

    // always open at the top: the curtain collapses onto the headline's dot, which must be on screen
    history.scrollRestoration = "manual";
    scrollTo(0, 0);

    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // no scrolling under the curtain

    const cleanups = [];
    const ctx = gsap.context(() => {
      /* ---------- 1. Enter: the yellow curtain collapses into the headline's dot ---------- */
      const title = document.querySelector(".ab-intro .ab-title");
      const dot = title.querySelector(".ab-dot");
      // measure before anything moves: the dot's resting place is where the curtain lands
      const d = dot.getBoundingClientRect();
      const cx = d.left + d.width / 2;
      const cy = d.top + d.height / 2;

      const titleSplit = SplitText.create(title, { type: "lines,chars", mask: "lines" });
      const bioSplit = SplitText.create(".ab-bio", { type: "words" });
      const kicker = document.querySelector(".ab-intro .ab-kicker");

      gsap.set(titleSplit.chars, { yPercent: 115, scaleY: 1.8, transformOrigin: "50% 100%" });
      gsap.set(bioSplit.words, { opacity: 0, filter: "blur(12px)", y: 14 });
      gsap.set(kicker, { opacity: 0 });

      const intro = gsap.timeline({ delay: 0.25, onComplete: () => lenis.start() });
      intro
        .fromTo(
          curtain,
          { clipPath: `circle(150% at ${cx}px ${cy}px)` },
          { clipPath: `circle(${d.width / 2}px at ${cx}px ${cy}px)`, duration: 1.15, ease: "expo.inOut" }
        )
        .set(curtain, { display: "none" })
        .to(titleSplit.chars, { yPercent: 0, scaleY: 1, duration: 1.1, stagger: 0.022, ease: "ab-snap" }, 0.45)
        // the dot lands with a squash, like it fell into place
        .fromTo(dot, { scale: 1.6 }, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.35)" }, 1.25)
        .to(kicker, { opacity: 1, duration: 0.01 }, 0.9)
        .to(kicker, { duration: 0.9, scrambleText: { text: kicker.textContent, chars: "upperCase", speed: 0.6 } }, 0.9)
        .to(bioSplit.words, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: 0.025, ease: "power2.out" }, 1.1);

      // on scroll the two headline lines drift apart and the intro sinks back
      // move the masks: the lines inside them are clipped on every side
      gsap.to(titleSplit.masks[0], {
        xPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".ab-intro", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(titleSplit.masks.slice(1), {
        xPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".ab-intro", start: "top top", end: "bottom top", scrub: true },
      });

      /* ---------- 2. Numbers: rules draw in, values count up ---------- */
      const numbers = document.querySelector(".ab-numbers");
      const numTl = gsap.timeline({ scrollTrigger: { trigger: numbers, start: "top 80%" } });
      numTl.fromTo(numbers, { "--line": 0 }, { "--line": 1, duration: 1.4, ease: "expo.inOut" });
      gsap.utils.toArray(".ab-number").forEach((el, i) => {
        const value = el.querySelector(".ab-number-value");
        const label = el.querySelector(".ab-number-label");
        // keep the real figure: this effect can run twice (dev), and the first run writes "0+"
        value.dataset.v ??= value.textContent;
        const [, n, suffix] = value.dataset.v.match(/(\d+)(.*)/);
        const counter = { v: 0 };
        value.textContent = `0${suffix}`;
        numTl
          .from(value, { yPercent: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.3 + i * 0.12)
          .to(counter, {
            v: +n,
            duration: 1.6,
            ease: "expo.out",
            onUpdate: () => (value.textContent = `${Math.round(counter.v)}${suffix}`),
          }, 0.3 + i * 0.12)
          .from(label, { opacity: 0, y: 10, duration: 0.6 }, 0.6 + i * 0.12);
      });

      /* ---------- 3. Section labels decode as they arrive ---------- */
      gsap.utils.toArray(".ab-block .ab-heading").forEach((h) => {
        const text = h.textContent;
        gsap.to(h, {
          duration: 1,
          scrambleText: { text, chars: "upperCase", speed: 0.5, revealDelay: 0.2 },
          scrollTrigger: { trigger: h, start: "top 85%" },
        });
      });

      /* ---------- 4. Services: index decodes, title rises out of its mask, copy unblurs ---------- */
      gsap.utils.toArray(".ab-services li").forEach((li) => {
        const index = li.querySelector(".ab-index");
        const h3 = SplitText.create(li.querySelector("h3"), { type: "chars", mask: "chars" });
        const p = SplitText.create(li.querySelector("p"), { type: "words" });
        gsap
          .timeline({ scrollTrigger: { trigger: li, start: "top 85%" } })
          .to(index, { duration: 0.8, scrambleText: { text: index.textContent, chars: DIGITS, speed: 0.4 } }, 0)
          .from(h3.chars, { yPercent: 110, rotate: 6, duration: 0.9, stagger: 0.025, ease: "ab-snap" }, 0.1)
          .from(p.words, { opacity: 0, filter: "blur(8px)", y: 8, duration: 0.6, stagger: 0.02 }, 0.35);
      });

      /* ---------- 5. Timeline: a yellow line is drawn by the scroll; each role lights up as it passes ---------- */
      const track = document.querySelector(".ab-track");
      gsap.fromTo(
        ".ab-progress",
        { "--fill": "0%" },
        { "--fill": "100%", ease: "none", scrollTrigger: { trigger: track, start: "top 65%", end: "bottom 65%", scrub: 0.6 } }
      );
      gsap.utils.toArray(".ab-timeline li").forEach((li) => {
        const year = li.querySelector(".ab-year");
        const role = SplitText.create(li.querySelector("h3"), { type: "chars", mask: "chars" });
        const tl = gsap
          .timeline({ paused: true })
          .to(year, { duration: 0.9, scrambleText: { text: year.textContent, chars: DIGITS, speed: 0.5 } })
          .from(role.chars, { yPercent: 110, duration: 0.8, stagger: 0.02, ease: "ab-snap" }, 0)
          .from(li.querySelector("p"), { opacity: 0, y: 12, duration: 0.6 }, 0.25);
        ScrollTrigger.create({
          trigger: li,
          start: "top 65%",
          toggleClass: "is-on",
          onEnter: () => tl.play(),
        });
      });

      /* ---------- 6. Big type leans into fast scrolling ---------- */
      const skewers = gsap.utils.toArray(".ab-services h3, .ab-timeline h3, .ab-number-value");
      const skewTo = skewers.map((el) => gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }));
      ScrollTrigger.create({
        onUpdate: (self) => {
          const s = gsap.utils.clamp(-6, 6, self.getVelocity() / -400);
          skewTo.forEach((to) => to(s));
        },
      });

      /* ---------- 7. Footer: the same blur reveal as the home page ---------- */
      gsap.utils.toArray(".site-footer .reveal").forEach((el) => {
        const { words } = SplitText.create(el, { type: "words" });
        gsap.from(words, {
          opacity: 0,
          filter: "blur(10px)",
          y: 8,
          duration: 0.8,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });
    });

    /* ---------- 8. Mouse only: a yellow cursor dot and magnetic buttons ---------- */
    if (matchMedia("(pointer: fine)").matches) {
      const cursor = document.createElement("div");
      cursor.className = "ab-cursor";
      cursor.setAttribute("aria-hidden", "true");
      document.body.append(cursor);
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
      const onMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        cursor.classList.toggle("is-big", !!e.target.closest("a, button, input"));
        cursor.classList.add("is-on");
      };
      const onLeave = () => cursor.classList.remove("is-on");
      addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        cursor.remove();
      });

      document.querySelectorAll(".footer-button, .menulist .talk").forEach((btn) => {
        const bx = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const by = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const pull = (e) => {
          const r = btn.getBoundingClientRect();
          bx((e.clientX - r.left - r.width / 2) * 0.35);
          by((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const release = () => {
          bx(0);
          by(0);
        };
        btn.addEventListener("pointermove", pull);
        btn.addEventListener("pointerleave", release);
        cleanups.push(() => {
          btn.removeEventListener("pointermove", pull);
          btn.removeEventListener("pointerleave", release);
          gsap.set(btn, { clearProps: "transform" });
        });
      });
    }

    // fonts change line breaks: re-measure once they're in
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.querySelectorAll(".ab-number-value[data-v]").forEach((el) => (el.textContent = el.dataset.v));
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

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

// Renders nothing: drives every animation on /artworks. Nothing is pinned.
// The text moves the way it does on /about: big type rises out of masks and leans into fast
// scrolling, copy unblurs word by word, mono labels and numbers decode.
export default function ArtworksAnimations() {
  useEffect(() => {
    const curtain = document.querySelector(".ab-curtain");
    // the curtain's CSS fallback hides it on its own if this never runs; from here JS owns it
    if (curtain) curtain.style.animation = "none";

    // reduced motion keeps the plain page: every card already standing
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (curtain) curtain.style.display = "none";
      return;
    }

    CustomEase.create("ab-snap", "0.16, 1, 0.3, 1");

    // always open at the top: the curtain collapses onto the title's dot, which must be on screen
    history.scrollRestoration = "manual";
    scrollTo(0, 0);

    const lenis = new Lenis({ anchors: true }); // the cards in the line are #links to their plates
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // no scrolling under the curtain

    const cleanups = [];
    const ctx = gsap.context(() => {
      /* ---------- 1. Enter: the curtain collapses into the title's dot, then the line slides in ---------- */
      const title = document.querySelector(".aw-title");
      const d = title.querySelector(".ab-dot").getBoundingClientRect();
      const cx = d.left + d.width / 2;
      const cy = d.top + d.height / 2;

      const titleSplit = SplitText.create(title, { type: "chars", mask: "chars" });
      const lede = SplitText.create(".aw-lede", { type: "words" });
      const hint = document.querySelector(".aw-hint");

      gsap.set(titleSplit.chars, { yPercent: 115, scaleY: 1.8, transformOrigin: "50% 100%" });
      gsap.set(lede.words, { opacity: 0, filter: "blur(12px)", y: 14 });
      gsap.set(hint, { opacity: 0 });
      gsap.set(".aw-row", { opacity: 0, x: -160 });

      gsap
        .timeline({ delay: 0.25, onComplete: () => lenis.start() })
        .fromTo(
          curtain,
          { clipPath: `circle(150% at ${cx}px ${cy}px)` },
          { clipPath: `circle(${d.width / 2}px at ${cx}px ${cy}px)`, duration: 1.15, ease: "expo.inOut" }
        )
        .set(curtain, { display: "none" })
        .to(titleSplit.chars, { yPercent: 0, scaleY: 1, duration: 1.1, stagger: 0.022, ease: "ab-snap" }, 0.45)
        .fromTo(".aw-title .ab-dot", { scale: 1.6 }, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.35)" }, 1.25)
        .to(lede.words, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: 0.025, ease: "power2.out" }, 1.1)
        // the line of cards (already drifting: CSS) slides in from the side it comes from
        .to(".aw-row", { opacity: 1, x: 0, duration: 1.5, ease: "ab-snap" }, 0.9)
        // the hint decodes, like the kicker on /about
        .to(hint, { opacity: 1, duration: 0.01 }, 1.5)
        .to(hint, { duration: 0.9, scrambleText: { text: hint.textContent, chars: "upperCase", speed: 0.6 } }, 1.5);

      // on scroll the title drifts aside as the first screen leaves (the /about headline does the same)
      gsap.to(title, {
        xPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".aw-top", start: "top top", end: "bottom top", scrub: true },
      });

      /* ---------- 2. Plates: the card grows up out of its floor line, the text follows ---------- */
      gsap.utils.toArray(".aw-plate").forEach((plate) => {
        const card = plate.querySelector(".aw-card");
        if (card) {
          // wiped up from the floor line while the picture settles back into its frame; once, not scrubbed
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 78%" } })
            .fromTo(card, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.out" })
            .from(card.querySelector("img"), { scale: 1.2, duration: 1.6, ease: "expo.out" }, 0);
        }

        const name = SplitText.create(plate.querySelector(".aw-name"), { type: "chars", mask: "chars" });
        const does = SplitText.create(plate.querySelector(".aw-does"), { type: "words" });
        const tl = gsap
          .timeline({ scrollTrigger: { trigger: plate, start: "top 78%" } })
          .from(name.chars, { yPercent: 110, rotate: 6, duration: 0.9, stagger: 0.025, ease: "ab-snap" }, 0)
          .from(does.words, { opacity: 0, filter: "blur(8px)", y: 8, duration: 0.6, stagger: 0.02 }, 0.3)
          .from(plate.querySelectorAll(".aw-facts div, .aw-visit, .aw-caption"), { opacity: 0, y: 10, duration: 0.6, stagger: 0.07 }, 0.45);
        // mono labels decode as their rows arrive; numbers decode in digits (the index and years on /about)
        plate.querySelectorAll(".aw-facts dt, .aw-caption span:last-child").forEach((el, k) => {
          tl.to(el, { duration: 0.8, scrambleText: { text: el.textContent, chars: "upperCase", speed: 0.5 } }, 0.5 + k * 0.07);
        });
        plate.querySelectorAll(".aw-facts div:first-child dd, .aw-caption span:first-child").forEach((el) => {
          tl.to(el, { duration: 0.9, scrambleText: { text: el.textContent, chars: DIGITS, speed: 0.5 } }, 0.5);
        });
      });

      /* ---------- 3. Big type leans into fast scrolling ---------- */
      const skewers = gsap.utils.toArray(".aw-name");
      const skewTo = skewers.map((el) => gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }));
      ScrollTrigger.create({
        onUpdate: (self) => {
          const s = gsap.utils.clamp(-6, 6, self.getVelocity() / -400);
          skewTo.forEach((to) => to(s));
        },
      });
      // a jump (keyboard, scrollbar) ends on a fast last frame: stand the type back up once the scroll stops
      const upright = () => skewTo.forEach((to) => to(0));
      ScrollTrigger.addEventListener("scrollEnd", upright);
      cleanups.push(() => ScrollTrigger.removeEventListener("scrollEnd", upright));

      /* ---------- 4. Footer: the same blur reveal as the other pages ---------- */
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

    /* ---------- 5. Mouse only: magnetic buttons, as on /about and /lets-talk ---------- */
    if (matchMedia("(pointer: fine)").matches) {
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

    // fonts and screenshots change heights: re-measure once they're in
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

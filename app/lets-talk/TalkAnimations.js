"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);

// Renders nothing: the /lets-talk entrance (same grammar as AboutAnimations). The hands'
// reach-in is GapHands' own; this does the curtain, the type and the magnetic buttons.
export default function TalkAnimations() {
  useEffect(() => {
    const curtain = document.querySelector(".ab-curtain");
    // the curtain's CSS fallback hides it on its own if this never runs; from here JS owns it
    if (curtain) curtain.style.animation = "none";

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (curtain) curtain.style.display = "none";
      return;
    }

    CustomEase.create("lt-snap", "0.16, 1, 0.3, 1");
    history.scrollRestoration = "manual";
    scrollTo(0, 0);

    const cleanups = [];
    const ctx = gsap.context(() => {
      // the curtain shrinks into the spark between the fingertips: the page starts at the connection
      const spark = document.querySelector(".gap-spark").getBoundingClientRect();
      const cx = spark.left + spark.width / 2;
      const cy = spark.top + spark.height / 2;
      const title = SplitText.create(".gap-title", { type: "lines,chars", mask: "lines" });

      gsap.set(title.chars, { yPercent: 115, scaleY: 1.8, transformOrigin: "50% 100%" });
      gsap.set([".gap-lede", ".gap-status li", ".gap-form", ".gap-meter"], { opacity: 0, y: 14 });

      gsap
        .timeline({ delay: 0.25 })
        .fromTo(
          curtain,
          { clipPath: `circle(150% at ${cx}px ${cy}px)` },
          { clipPath: `circle(${spark.width / 2}px at ${cx}px ${cy}px)`, duration: 1.15, ease: "expo.inOut" }
        )
        .set(curtain, { display: "none" })
        .fromTo(".gap-spark", { scale: 1.8 }, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.35)" }, 1.15)
        .to(title.chars, { yPercent: 0, scaleY: 1, duration: 1.1, stagger: 0.022, ease: "lt-snap" }, 1.2)
        .to([".gap-lede", ".gap-status li"], { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 1.6)
        .to(".gap-form", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 2)
        .to(".gap-meter", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.2);
    });

    // mouse only: magnetic buttons
    if (matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll(".menulist .talk, .gap-controls .brief-send").forEach((btn) => {
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

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}

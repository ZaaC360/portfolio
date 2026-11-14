"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);

const STEP = 40; // % of a screen scrolled per stop of the walk

// Renders nothing: drives /stack. Pins the sheet and walks it: intro, each part, assembled.
// The moves themselves are CSS transitions on .is-on / .is-shut (globals.css); this picks the stop.
export default function StackAnimations() {
  useEffect(() => {
    const curtain = document.querySelector(".ab-curtain");
    // the curtain's CSS fallback hides it on its own if this never runs; from here JS owns it
    if (curtain) curtain.style.animation = "none";

    // reduced motion keeps the plain page: everything listed, nothing pinned.
    // So does a very short phone, where the plate, the tower and the notes cannot share one screen.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || (innerWidth <= 768 && innerHeight < 620)) {
      if (curtain) curtain.style.display = "none";
      return;
    }

    const page = document.querySelector(".sk-page");
    page.classList.add("is-live", "is-shut");
    CustomEase.create("ab-snap", "0.16, 1, 0.3, 1");
    history.scrollRestoration = "manual";
    scrollTo(0, 0);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // no scrolling under the curtain

    const cards = gsap.utils.toArray(".sk-card"); // intro, the parts, assembled
    const slots = gsap.utils.toArray(".sk-slot");
    const list = document.querySelector(".sk-parts");
    const rows = gsap.utils.toArray(".sk-parts a").reverse(); // listed top-down: flip to part order
    const n = slots.length;

    // name plates: one line, as wide as their column (like CREATIVE / DEVELOPER in the hero)
    const fit = () => {
      const col = cards[0].clientWidth;
      const cap = innerHeight * (innerWidth > 768 ? 0.3 : 0.14);
      gsap.utils.toArray(".sk-fit").forEach((el) => {
        el.style.fontSize = "100px";
        el.style.fontSize = `${Math.min(cap, (100 * col) / el.offsetWidth)}px`;
      });
    };
    ScrollTrigger.addEventListener("refreshInit", fit);

    let ctx;
    let walk;
    let alive = true;
    const onPick = (e) => {
      const i = rows.indexOf(e.target.closest("a"));
      if (i < 0 || !walk) return;
      e.preventDefault();
      // the middle of that part's stop
      lenis.scrollTo(walk.start + ((i + 1.5) / (n + 2)) * (walk.end - walk.start));
    };
    list.addEventListener("click", onPick);

    // the plates are measured against the title face: wait for it (the curtain covers the wait)
    document.fonts.load('500 1em "MyFont"').finally(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        fit();
        const dot = document.querySelector(".sk-intro .ab-dot").getBoundingClientRect();
        const cx = dot.left + dot.width / 2;
        const cy = dot.top + dot.height / 2;

        const plates = cards.map((c) => SplitText.create(c.querySelector(".sk-fit"), { type: "lines,chars", mask: "lines" }));
        const lede = SplitText.create(".sk-intro .sk-does", { type: "words" });
        const view = document.querySelector(".sk-view");

        /* ---------- the walk: -1 intro, 0..n-1 a part pulled out, n assembled ---------- */
        let stop = -1;
        const show = (i) => {
          if (i === stop) return;
          stop = i;
          cards.forEach((c, k) => c.classList.toggle("is-on", k === i + 1));
          slots.forEach((s, k) => s.classList.toggle("is-on", k === i));
          rows.forEach((r, k) => (k === i ? r.setAttribute("aria-current", "true") : r.removeAttribute("aria-current")));
          page.classList.toggle("is-shut", i === n);
          gsap.fromTo(
            plates[i + 1].chars,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.9, stagger: 0.02, ease: "ab-snap", overwrite: true }
          );
          const text = i < 0 ? "Exploded" : i === n ? "Assembled" : `Part ${String(i + 1).padStart(2, "0")}`;
          gsap.to(view, { duration: 0.6, scrambleText: { text, chars: "upperCase", speed: 0.6 }, overwrite: true });
        };

        // the tower turns a little over the whole walk; the balloons counter-rotate (CSS)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".sk-stage",
            start: "top top",
            end: `+=${(n + 2) * STEP}%`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => show(Math.min(n + 1, Math.floor(self.progress * (n + 2))) - 1),
          },
        });
        tl.fromTo(".sk-page .tower", { "--spin": "-40deg" }, { "--spin": "-24deg", ease: "none" });
        walk = tl.scrollTrigger;

        /* ---------- enter: the curtain collapses into the title's dot, then the sheet draws itself ---------- */
        gsap.set(plates[0].chars, { yPercent: 115, scaleY: 1.8, transformOrigin: "50% 100%" });
        gsap.set(lede.words, { opacity: 0, filter: "blur(12px)", y: 14 });
        gsap.set([".sk-ruler", ".sk-parts li", ".sk-block", ".sk-hint"], { opacity: 0 });
        gsap
          .timeline({ delay: 0.25, onComplete: () => lenis.start() })
          .fromTo(
            curtain,
            { clipPath: `circle(150% at ${cx}px ${cy}px)` },
            { clipPath: `circle(${dot.width / 2}px at ${cx}px ${cy}px)`, duration: 1.15, ease: "expo.inOut" }
          )
          .set(curtain, { display: "none" })
          .fromTo(".sk-sheet", { "--line": 0 }, { "--line": 1, duration: 1.4, ease: "expo.inOut" }, 0.4)
          .to(plates[0].chars, { yPercent: 0, scaleY: 1, duration: 1.1, stagger: 0.022, ease: "ab-snap" }, 0.45)
          .fromTo(".sk-intro .ab-dot", { scale: 1.6 }, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.35)" }, 1.25)
          // the tower springs apart (CSS transition), bottom slab first
          .call(() => page.classList.remove("is-shut"), null, 1)
          .to(lede.words, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: 0.025, ease: "power2.out" }, 1.1)
          .to(".sk-parts li", { opacity: 1, duration: 0.5, stagger: -0.05 }, 1.3)
          .to([".sk-ruler", ".sk-block", ".sk-hint"], { opacity: 1, duration: 0.6, stagger: 0.1 }, 1.7);

        /* ---------- footer: the same blur reveal as the other pages ---------- */
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
    });

    return () => {
      alive = false;
      list.removeEventListener("click", onPick);
      ScrollTrigger.removeEventListener("refreshInit", fit);
      ctx?.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      page.classList.remove("is-live", "is-shut");
      cards.forEach((c, k) => c.classList.toggle("is-on", k === 0));
      slots.forEach((s) => s.classList.remove("is-on"));
    };
  }, []);

  return null;
}

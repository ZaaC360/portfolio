"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Element's own transform applied around its transform-origin.
function ownMatrix(el) {
  const cs = getComputedStyle(el);
  const m = cs.transform === "none" ? new DOMMatrix() : new DOMMatrix(cs.transform);
  const [ox, oy] = cs.transformOrigin.split(" ").map(parseFloat);
  return new DOMMatrix().translate(ox, oy).multiply(m).translate(-ox, -oy);
}

// Layer-local (u, v) -> hero coords, through the hero perspective, scene tilt and layer z.
function layerMatrix(hero, scene, layer) {
  const d = parseFloat(getComputedStyle(hero).perspective);
  const ox = hero.clientWidth / 2;
  const oy = hero.clientHeight / 2;
  const persp = new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / d, 0, 0, 0, 1]);
  return new DOMMatrix()
    .translate(ox, oy).multiply(persp).translate(-ox, -oy)
    .multiply(ownMatrix(scene))
    .translate(layer.offsetLeft, layer.offsetTop)
    .multiply(ownMatrix(layer));
}

// Where the photo's (0,0) and (W,H) corners appear on the DEVELOPER plane, as seen by the viewer.
// Parallel planes under one perspective map by scale + offset, so two corners are enough.
function silhouetteOnLower(hero, scene, photo, lower) {
  const P = layerMatrix(hero, scene, photo);
  const L = layerMatrix(hero, scene, lower);
  // Inverse of the lower plane's 2D homography (columns u, v, 1 -> x, y, w).
  const a = L.m11, b = L.m21, c = L.m41, d = L.m12, e = L.m22, f = L.m42, g = L.m14, h = L.m24, i = L.m44;
  const A = e * i - f * h, B = c * h - b * i, C = b * f - c * e;
  const D = f * g - d * i, E = a * i - c * g, F = c * d - a * f;
  const G = d * h - e * g, H = b * g - a * h, I = a * e - b * d;
  const toLower = (u, v) => {
    const p = P.transformPoint(new DOMPoint(u, v, 0, 1));
    const x = p.x / p.w, y = p.y / p.w;
    const w = G * x + H * y + I;
    return [(A * x + B * y + C) / w, (D * x + E * y + F) / w];
  };
  const [x0, y0] = toLower(0, 0);
  const [x1, y1] = toLower(photo.offsetWidth, photo.offsetHeight);
  return { pos: `${x0}px ${y0}px`, size: `${x1 - x0}px ${y1 - y0}px` };
}

// Renders nothing, just animates the page.
export default function Animations() {
  useEffect(() => {
    // A reload always starts at the top: restoring mid-page lands inside a pinned animation.
    history.scrollRestoration = "manual";
    scrollTo(0, 0);

    // Loader stays up until the first screen can render correctly: title font, page load,
    // hero photo (never less than 1.8s so it reads, never more than 6s).
    const html = document.documentElement;
    const loader = document.querySelector(".loader");
    const pageLoaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true }));
    const heroImg = document.querySelector(".layer-photo img")?.decode().catch(() => {});
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const ready = Promise.all([Promise.race([Promise.all([document.fonts.ready, pageLoaded, heroImg]), wait(6000)]), wait(1800)]);

    // Visitors who asked their OS for less motion get the static poster: no smooth scroll, no
    // pinning, and the loader just disappears when ready.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ready.then(() => {
        if (loader) loader.style.display = "none"; // hide, not remove: React owns this node
        html.classList.remove("is-loading");
      });
      return;
    }

    // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
    // anchors: nav links (#about, #contact...) glide instead of jumping.
    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (loader) lenis.stop(); // no scrolling under the loader
    let alive = true; // the loader steps below are async: skip them once unmounted

    let trackMask = () => {};
    let offDeckHint = () => {};
    let offMagnet = () => {};
    const ctx = gsap.context(() => {
      // nav: the same blur reveal as the page text, played once the loader opens
      const navIntro = [
        gsap.from(".menuitem", { y: -20, opacity: 0, filter: "blur(10px)", stagger: 0.2, duration: 0.7, clearProps: "filter", paused: true }),
        gsap.from(".logo", { y: -20, opacity: 0, filter: "blur(10px)", duration: 0.7, clearProps: "filter", paused: true }),
      ];

      // Loader: an outlined 100 fills up (to 90%) while a build log ticks off what has really
      // loaded; once ready it hits 100, its yellow dot floods the screen, and the yellow
      // collapses (circle clip) onto the yellow dot after CREATIVE in the hero.
      const reveal = () => {
        if (loader) loader.style.display = "none"; // hide, not remove: React owns this node
        html.classList.remove("is-loading");
        lenis.start();
        ScrollTrigger.refresh();
        navIntro.forEach((t) => t.play());
      };
      if (!loader) reveal();
      else {
        const num = loader.querySelector(".fill-num");
        const solid = loader.querySelector(".fill-solid");
        const pct = loader.querySelector(".loader-pct");
        const dot = loader.querySelector(".loader-dot");
        const logEl = loader.querySelector(".loader-log");
        const prog = { v: 0 };
        const draw = () => {
          solid.style.clipPath = `inset(${100 - prog.v}% 0 0 0)`; // fill rises from the bottom
          pct.textContent = `${String(Math.round(prog.v)).padStart(3, "0")}%`;
        };
        const log = (text, ok = true) => {
          if (!alive) return;
          const li = document.createElement("li");
          li.innerHTML = ok ? `<b>✓</b> ${text}` : text;
          logEl.appendChild(li);
          gsap.from(li, { opacity: 0, x: -12, filter: "blur(6px)", duration: 0.4, ease: "power2.out" });
        };

        logEl.textContent = ""; // a dev double-mount would otherwise leave its lines behind
        log("&gt; zaac.portfolio --build", false);
        const counting = gsap.to(prog, { v: 90, duration: 2.4, ease: "power1.out", onUpdate: draw });
        document.fonts.ready.then(() => {
          if (!alive) return;
          gsap.set(num, { visibility: "visible" });
          log("typeface&nbsp;&nbsp;NewTitle");
        });
        Promise.resolve(heroImg).then(() => log("hero&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;photo decoded"));
        pageLoaded.then(() => log("assets&nbsp;&nbsp;&nbsp;&nbsp;loaded"));

        ready.then(() => {
          if (!alive) return;
          counting.kill();
          log("motion&nbsp;&nbsp;&nbsp;&nbsp;gsap · lenis · scrolltrigger");
          log("&gt; ready_", false);
          // where the hero's yellow dot is: the loader collapses exactly onto it
          const r = document.querySelector(".layer-dot").getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const far = Math.hypot(innerWidth, innerHeight);
          gsap
            .timeline()
            .to(prog, { v: 100, duration: 0.5, ease: "power1.out", onUpdate: draw })
            .to([num, logEl, loader.querySelector(".loader-tag")], { opacity: 0, filter: "blur(10px)", duration: 0.45 }, "+=0.3")
            .to(dot, { scale: (far * 2) / dot.offsetWidth, duration: 0.8, ease: "power3.in" }, "<")
            .set(loader, { background: "#ffd632" })
            .fromTo(
              loader,
              { clipPath: `circle(${far}px at ${cx}px ${cy}px)` },
              { clipPath: `circle(${r.width / 2}px at ${cx}px ${cy}px)`, duration: 1.1, ease: "power4.inOut" }
            )
            .add(reveal);
        });
      }

      // Hero: tilt the scene back until every layer is edge-on (90deg) while they lift apart,
      // so the scroll ends on a stack of thin lines: plate -> CREATIVE -> photo -> DEVELOPER.
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".hero", start: "top top", end: "+=150%", scrub: 1, pin: true },
      })
        // y re-centres the stack (z lifts it upward); near-orthographic perspective at the end
        // flattens each edge-on layer into a thin line
        .to(".scene", { rotateX: 90, scale: 0.75, y: 110 }, 0)
        .to(".hero", { perspective: 6000 }, 0)
        .to(".plate", { boxShadow: "0 60px 120px rgba(0,0,0,0.25)", duration: 0.35 }, 0)
        .to(".text-upper", { z: 100 }, 0)
        .to(".layer-photo", { z: 200 }, 0)
        // shadow on the img, not the layer: filter on a layer would flatten its 3D edge
        .to(".layer-photo img", { filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }, 0)
        .to(".text-lower", { z: 300 }, 0);

      // Keep DEVELOPER's white/black split on wherever the photo actually appears behind it.
      const els = [".hero", ".scene", ".layer-photo", ".text-lower"].map((s) => document.querySelector(s));
      const lower = els[3];
      let last = "";
      trackMask = () => {
        const { pos, size } = silhouetteOnLower(...els);
        // edge-on (90deg) the DEVELOPER plane has no area, the projection is undefined
        if (pos.includes("NaN") || pos.includes("Infinity") || pos + size === last) return;
        last = pos + size;
        lower.style.setProperty("--sil-pos", pos);
        lower.style.setProperty("--sil-size", size);
      };
      gsap.ticker.add(trackMask);

      // slide exactly the overflow, so the last word ends at the right edge on any screen size
      const aboutH1 = document.querySelector(".about h1");
      gsap.to(aboutH1, {
        x: () => -(aboutH1.scrollWidth - aboutH1.clientWidth),
        scrollTrigger: { trigger: ".about", start: "top top", end: "+=3000", scrub: 2, pin: true, invalidateOnRefresh: true },
      });

      // Selected Work: pinned for two screens of scroll, dropping one card at each quarter
      // (3 drops); scrolling back up stands them up again. Clicks still drop extra cards.
      const deck = document.querySelector(".artwork .td-root");
      const hint = document.querySelector(".deck-hint");
      if (deck) {
        const DROPS = 3;
        let dropped = 0;
        ScrollTrigger.create({
          trigger: ".artwork",
          start: "top top",
          end: "+=200%",
          pin: true,
          onUpdate: (self) => {
            const want = Math.min(DROPS, Math.floor(self.progress * (DROPS + 1)));
            if (want === dropped) return;
            deck.dispatchEvent(new CustomEvent("tumble:step", { detail: want - dropped }));
            dropped = want;
          },
        });
      }

      // a "Click to drop" pill follows the cursor while it is over the deck
      if (deck && hint) {
        const section = document.querySelector(".artwork");
        const onHintMove = (e) => {
          const r = section.getBoundingClientRect();
          hint.style.setProperty("--hx", `${e.clientX - r.left}px`);
          hint.style.setProperty("--hy", `${e.clientY - r.top}px`);
          hint.classList.add("is-on");
        };
        const onHintLeave = () => hint.classList.remove("is-on");
        deck.addEventListener("pointermove", onHintMove);
        deck.addEventListener("pointerleave", onHintLeave);
        offDeckHint = () => {
          deck.removeEventListener("pointermove", onHintMove);
          deck.removeEventListener("pointerleave", onHintLeave);
        };
      }

      // Magnetic send button: on a real mouse it leans toward the cursor, snaps back on leave
      const send = document.querySelector(".brief-send");
      if (send && matchMedia("(hover: hover)").matches) {
        const xTo = gsap.quickTo(send, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(send, "y", { duration: 0.4, ease: "power3" });
        const pull = (e) => {
          const r = send.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const release = () => {
          xTo(0);
          yTo(0);
        };
        send.addEventListener("pointermove", pull);
        send.addEventListener("pointerleave", release);
        offMagnet = () => {
          send.removeEventListener("pointermove", pull);
          send.removeEventListener("pointerleave", release);
        };
      }

      // Blur reveal: every .reveal text unblurs word by word, left to right, as it scrolls
      // into view (and blurs back out if you scroll back above it). Captions inside pinned
      // sections trigger off their section, since the pin moves them.
      gsap.utils.toArray(".reveal").forEach((el) => {
        const { words } = SplitText.create(el, { type: "words" });
        const pinned = el.closest(".stack, .artwork");
        // the contact sentence's blanks reveal in reading order along with its words
        const targets = [...words, ...el.querySelectorAll("input")].sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        gsap.from(targets, {
          opacity: 0,
          filter: "blur(10px)",
          y: 8,
          duration: 0.8,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: pinned || el,
            start: pinned ? "top 70%" : "top 90%",
            toggleActions: "play none none reverse",
            // created before the stack pin: measure after it adds its scroll length, or
            // everything below the stack would trigger early and look static on arrival
            refreshPriority: -1,
          },
        });
      });

      // Stack: slabs drop in one by one (bottom first) while the tower turns, then it pulls
      // apart into an exploded view and the numbered leader lines appear.
      const slabs = gsap.utils.toArray(".slab");
      const tower = document.querySelector(".tower");
      const n = slabs.length;
      // exploded spacing: share ~62% of the screen height between the slabs (0.75s = flat diamond,
      // 0.85 = sin 58deg tilt), between a minimum that keeps labels apart and the 6-slab look
      const gap = () => {
        const s = tower.offsetWidth;
        return gsap.utils.clamp(s * 0.14, s * 0.3, (innerHeight * 0.62 - s * 0.75) / ((n - 1) * 0.85));
      };
      const step = 0.55 / n; // all slabs land by ~0.55, then the explode starts at 0.6
      const stackTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".stack", start: "top top", end: `+=${150 + n * 20}%`, scrub: 1, pin: true, invalidateOnRefresh: true },
      });
      stackTl.fromTo(".tower", { "--spin": "-80deg" }, { "--spin": "-20deg", duration: 1 }, 0);
      // the base slab is already in place, so the section never scrolls in empty
      // opacity snaps in at the start of the fall: a half-faded slab shows the edges behind it
      slabs.slice(1).forEach((el, i) =>
        stackTl
          .from(el, { z: () => tower.offsetWidth * 2.2, ease: "power2.in", duration: step }, i * step)
          .from(el, { opacity: 0, duration: step * 0.15 }, i * step)
      );
      stackTl
        .to(slabs, { z: (i) => i * gap(), ease: "power2.inOut", duration: 0.3 }, 0.6)
        // keep the tower centred: stacked it is (n-1) slab thicknesses tall (spine height = --t),
        // exploded (n-1) gaps; either way it grows upward from the base, so drop it by half
        .fromTo(
          ".tower-wrap",
          { y: () => ((n - 1) * document.querySelector(".slab-spine").offsetHeight * 0.85) / 2 },
          { y: () => ((n - 1) * gap() * 0.85) / 2, ease: "power2.inOut", duration: 0.3 },
          0.6
        )
        .fromTo(".slab-label", { opacity: 0 }, { opacity: 1, stagger: 0.15 / n, duration: 0.1 }, 0.75);
    });
    // the headline's width is only right once its font has loaded; re-measure then
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      alive = false;
      offDeckHint();
      offMagnet();
      ctx.revert();
      gsap.ticker.remove(tick);
      gsap.ticker.remove(trackMask);
      lenis.destroy();
    };
  }, []);

  return null;
}

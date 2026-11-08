"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

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
    // Visitors who asked their OS for less motion get the static poster: no smooth scroll, no pinning.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
    // anchors: nav links (#about, #contact...) glide instead of jumping.
    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let trackMask = () => {};
    let offDeckHint = () => {};
    const ctx = gsap.context(() => {
      gsap.from(".menuitem", { y: -20, opacity: 0, stagger: 0.2, duration: 0.7, delay: 0.3 });
      gsap.from(".logo", { y: -20, opacity: 0, duration: 0.7, delay: 0.3 });

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

      // Selected Work: the deck flips on click/tap only (TumbleDeckShowcase clickOnly);
      // a "Click to drop" pill follows the cursor while it is over the deck.
      const deck = document.querySelector(".artwork .td-root");
      const hint = document.querySelector(".deck-hint");
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
        // exploded tower grows upward; slide it down by half the growth to stay centred (0.85 = sin 58deg tilt)
        .to(".tower-wrap", { y: () => ((n - 1) * gap() * 0.85) / 2, ease: "power2.inOut", duration: 0.3 }, 0.6)
        .fromTo(".slab-label", { opacity: 0 }, { opacity: 1, stagger: 0.15 / n, duration: 0.1 }, 0.75);
    });
    // the headline's width is only right once its font has loaded; re-measure then
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      offDeckHint();
      ctx.revert();
      gsap.ticker.remove(tick);
      gsap.ticker.remove(trackMask);
      lenis.destroy();
    };
  }, []);

  return null;
}

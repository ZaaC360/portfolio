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
    // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let trackMask = () => {};
    const ctx = gsap.context(() => {
      gsap.from(".menuitem", { y: -20, opacity: 0, stagger: 0.2, duration: 0.7, delay: 0.3 });
      gsap.from(".logo", { y: -20, opacity: 0, duration: 0.7, delay: 0.3 });

      // Hero: tilt the whole scene back while the three layers lift apart:
      // CREATIVE (bottom) -> photo -> DEVELOPER (top).
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".hero", start: "top top", end: "+=150%", scrub: 1, pin: true },
      })
        .to(".scene", { rotateX: 50, rotateZ: -10, scale: 0.75 }, 0)
        .to(".plate", { boxShadow: "0 60px 120px rgba(0,0,0,0.25)" }, 0)
        .to(".text-upper", { z: 80 }, 0)
        .to(".layer-photo", { z: 180, filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }, 0)
        .to(".text-lower", { z: 300 }, 0);

      // Keep DEVELOPER's white/black split on wherever the photo actually appears behind it.
      const els = [".hero", ".scene", ".layer-photo", ".text-lower"].map((s) => document.querySelector(s));
      const lower = els[3];
      let last = "";
      trackMask = () => {
        const { pos, size } = silhouetteOnLower(...els);
        if (pos + size === last) return;
        last = pos + size;
        lower.style.setProperty("--sil-pos", pos);
        lower.style.setProperty("--sil-size", size);
      };
      gsap.ticker.add(trackMask);

      gsap.to(".about h1", {
        x: "-120%",
        scrollTrigger: { trigger: ".about", start: "top top", end: "+=3000", scrub: 2, pin: true },
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      gsap.ticker.remove(trackMask);
      lenis.destroy();
    };
  }, []);

  return null;
}

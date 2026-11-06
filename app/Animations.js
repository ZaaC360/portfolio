"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ported from the old script.js; renders nothing, just animates the page.
export default function Animations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".menuitem", { y: -20, opacity: 0, stagger: 0.2, duration: 0.7, delay: 0.3 });
      gsap.from(".logo", { y: -20, opacity: 0, duration: 0.7, delay: 0.3 });
      gsap.to(".about h1", {
        x: "-120%",
        scrollTrigger: { trigger: ".about", start: "top top", end: "+=3000", scrub: 2, pin: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}

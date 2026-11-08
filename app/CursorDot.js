"use client";

import { useEffect } from "react";
import gsap from "gsap";

// Site-wide, mouse only: a yellow dot trailing the pointer, growing over anything clickable.
// Renders nothing itself: the dot is appended to <body> so no page layout can clip it.
export default function CursorDot() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = document.createElement("div");
    cursor.className = "cursor-dot";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      cursor.classList.toggle("is-big", !!e.target.closest?.("a, button, input, [role='button']"));
      cursor.classList.add("is-on");
    };
    const onLeave = () => cursor.classList.remove("is-on");
    addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cursor.remove();
    };
  }, []);

  return null;
}

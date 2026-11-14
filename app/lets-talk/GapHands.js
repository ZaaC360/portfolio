"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SRC, TILT, TILT_PHONE, dither, toneOf } from "../AsciiFooter";

// The footer's hands, drawn as the footer draws them (same tilt; the arms run on straight
// instead of mirrored), then split between the fingertips and slid apart along the tilt: the left hand is the
// visitor's, the right one Zaac's. `progress` (0..1, answers given) closes the gap a little
// with each answer; `touched` makes them meet.
// How far apart the fingertips are, as a share of the box width along the tilt.
const FAR = 0.9; // before the intro: hands pulled far out
const OPEN = 0.2; // no answers yet: a little apart
const CLOSE = 0.02; // all four answered: a sliver left for the send
const TOUCH = -0.006; // sent: fingertips meet
const FPS = 12; // shimmer rate; position moves on every frame

const gapFor = (progress, touched) => (touched ? TOUCH : OPEN + (CLOSE - OPEN) * progress);

export default function GapHands({ progress, touched, label }) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const gap = useRef({ v: FAR }); // current fingertip gap, tweened toward gapFor()
  const target = useRef(gapFor(progress, touched));

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = SRC;

    let cols = 0;
    let rows = 0;
    let cell = 3;
    let px = 0; // padding around the canvas in the prepared buffer, so a shift never runs out of arm
    let py = 0;
    let bw = 0; // buffer size
    let bh = 0;
    let cos = 1;
    let sin = 0;
    let u0 = 0; // the gap's centre along the tilt, from the buffer centre
    let natural = 0; // the photo's own fingertip gap along the tilt, in cells
    let tone = new Float32Array(0);
    let comp = new Float32Array(0);
    let out = null;
    let jitter = 0;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d", { willReadFrequently: true });

    // The footer's sample(), into a padded buffer.
    const sample = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = W;
      canvas.height = H;
      const phone = W < 600;
      cell = phone ? 2 : 3;
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      px = Math.round(cols * 0.3);
      py = Math.round(rows * 0.3);
      bw = cols + 2 * px;
      bh = rows + 2 * py;
      small.width = bw;
      small.height = bh;

      const tilt = phone ? TILT_PHONE : TILT;
      cos = Math.cos(tilt);
      sin = Math.sin(tilt);
      const bandRows = box.clientHeight / cell;
      const ratio = img.naturalHeight / img.naturalWidth;
      const dw = phone
        ? 2 * Math.min(cols / 2 / cos, bandRows / 2 / sin)
        : img.naturalWidth * Math.max(cols / img.naturalWidth, bandRows / img.naturalHeight);
      const dh = dw * ratio;
      sctx.imageSmoothingQuality = "high";
      sctx.clearRect(0, 0, bw, bh);
      sctx.save();
      sctx.translate(bw / 2, bh / 2);
      sctx.rotate(tilt);
      sctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      // each arm runs on straight: its last sliver of pixels stretched out past the edge
      const iw = img.naturalWidth, ih = img.naturalHeight, edge = 4, run = dw * 0.7;
      sctx.drawImage(img, 0, 0, edge, ih, -dw / 2 - run, -dh / 2, run + 1, dh);
      sctx.drawImage(img, iw - edge, 0, edge, ih, dw / 2 - 1, -dh / 2, run, dh);
      sctx.restore();
      tone = toneOf(sctx.getImageData(0, 0, bw, bh).data, bw, bh);

      // the real gap: the widest empty stretch along the tilt around the middle of the photo,
      // looking only at a strip along the fingers (thumbs and wrists elsewhere would fill it)
      const span = Math.round(dw * 0.2);
      const strip = dh * 0.12;
      const hit = new Uint8Array(2 * span + 1);
      for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
          if (tone[y * bw + x] <= 0.04) continue;
          const dx = x - bw / 2;
          const dy = y - bh / 2;
          const u = Math.round(dx * cos + dy * sin);
          if (u >= -span && u <= span && Math.abs(dy * cos - dx * sin) < strip) hit[u + span] = 1;
        }
      }
      let best = [0, 0];
      for (let i = 0, run = -1; i < hit.length; i++) {
        if (hit[i]) run = -1;
        else {
          if (run < 0) run = i;
          if (i - run > best[1] - best[0]) best = [run, i];
        }
      }
      u0 = (best[0] + best[1]) / 2 - span;
      natural = best[1] - best[0] + 1;

      comp = new Float32Array(cols * rows);
      small.width = cols; // the output only needs the canvas
      small.height = rows;
      out = sctx.createImageData(cols, rows);
    };

    // Each hand slides along the tilt (s cells; s < 0 slides them in), with the gap's centre
    // kept on the spark; each output cell takes the hand whose side of the gap it samples.
    const frame = () => {
      if (!out) return;
      const s = (gap.current.v * cols - natural) / 2;
      const cx = bw / 2;
      const cy = bh / 2;
      const lx = (u0 + s) * cos, ly = (u0 + s) * sin; // the left hand samples further along +u
      const rx = (u0 - s) * cos, ry = (u0 - s) * sin;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let t = 0;
          const ax = Math.round(x + px + lx), ay = Math.round(y + py + ly);
          if (ax >= 0 && ax < bw && ay >= 0 && ay < bh && (ax - cx) * cos + (ay - cy) * sin < u0) t = tone[ay * bw + ax];
          const bx = Math.round(x + px + rx), by = Math.round(y + py + ry);
          if (bx >= 0 && bx < bw && by >= 0 && by < bh && (bx - cx) * cos + (by - cy) * sin >= u0) t = Math.max(t, tone[by * bw + bx]);
          comp[y * cols + x] = t;
        }
      }
      dither(out, comp, cols, rows, jitter);
      sctx.putImageData(out, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, cols * cell, rows * cell);
    };

    let raf = 0;
    let last = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (t - last > 1000 / FPS) {
        last = t;
        jitter = reduce ? 0 : (Math.random() - 0.5) * 0.12;
      }
      frame();
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!raf) raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    const ro = new ResizeObserver(() => {
      if (!img.naturalWidth) return;
      sample();
      frame();
    });
    img.onload = () => {
      sample();
      // the intro: both hands reach in to their opening gap
      if (reduce) gap.current.v = target.current;
      else gsap.to(gap.current, { v: target.current, duration: 2.2, delay: 0.9, ease: "expo.out" });
      frame();
      ro.observe(box);
      io.observe(box);
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      img.onload = null;
      gsap.killTweensOf(gap.current);
    };
  }, []);

  // every answer pulls them a little closer; the send makes them meet (the first run is the intro's)
  const first = useRef(true);
  useEffect(() => {
    target.current = gapFor(progress, touched);
    if (first.current) {
      first.current = false;
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(gap.current, {
      v: target.current,
      duration: reduce ? 0 : touched ? 0.7 : 1.4,
      ease: touched ? "power4.in" : "expo.out",
      overwrite: true,
    });
  }, [progress, touched]);

  return (
    <div className={`gap-hands${progress === 1 ? " is-charged" : ""}${touched ? " is-touched" : ""}`} ref={boxRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="gap-spark" aria-hidden="true"></span>
      <p className="gap-meter">{label}</p>
    </div>
  );
}

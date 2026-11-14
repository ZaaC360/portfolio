"use client";

import { useEffect, useRef } from "react";

/*
 * Footer art: two reaching hands (Creation-of-Adam pose) as a fine grey pixel dither
 * on black — the 21st.dev "HandArt" render, re-dithered live at the footer's size.
 *   image -> cells -> key out the black backdrop -> levels + contrast + edges
 *   -> ordered (Bayer) dither, grey by brightness -> scaled up as crisp pixels.
 * The dither threshold jitters a little every frame, so the hands shimmer like a
 * live render. Grain and vignette are CSS layers (globals.css).
 */

// cropped from the 21st.dev HandArt preview: light hands on black, arms running off both edges
export const SRC = "/imgs/hands.png";
// strict rotation about the box centre: same size, same box; at 15deg the hands stay inside it
export const TILT = (15 * Math.PI) / 180;
// phones: a square band and a steeper diagonal, so the whole composition (both arms) fits
// corner to corner instead of the arms being cropped off the narrow screen
export const TILT_PHONE = (40 * Math.PI) / 180;
const CONTRAST = 1.15;
const EDGE = 0.4;
const FPS = 12;
// 4x4 Bayer matrix, thresholds in 0..1
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Image pixels (one per cell) -> per-cell brightness of the hands, 0 = backdrop:
// key out the black, auto-levels + contrast over the hands, then Sobel edge emphasis.
export function toneOf(px, cols, rows) {
  const n = cols * rows;
  const raw = new Float32Array(n);
  const keep = new Float32Array(n);
  const seen = [];
  for (let i = 0; i < n; i++) {
    raw[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
    // near-black is backdrop; anything lighter is hand
    keep[i] = smooth(0.05, 0.16, raw[i]);
    if (keep[i] > 0.5) seen.push(raw[i]);
  }
  // auto-levels over the hands only, then contrast 115
  seen.sort((a, b) => a - b);
  const lo = seen[Math.floor(seen.length * 0.03)] ?? 0;
  const hi = seen[Math.floor(seen.length * 0.98)] ?? 1;
  const base = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    base[i] = keep[i] * clamp01(((raw[i] - lo) / Math.max(0.05, hi - lo) - 0.5) * CONTRAST + 0.5);
  }
  // edge emphasis 40: Sobel on the cell grid sharpens fingers against the black
  const tone = new Float32Array(n);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const at = (dx, dy) => base[Math.min(rows - 1, Math.max(0, y + dy)) * cols + Math.min(cols - 1, Math.max(0, x + dx))];
      const gx = at(1, -1) + 2 * at(1, 0) + at(1, 1) - at(-1, -1) - 2 * at(-1, 0) - at(-1, 1);
      const gy = at(-1, 1) + 2 * at(0, 1) + at(1, 1) - at(-1, -1) - 2 * at(0, -1) - at(1, -1);
      const i = y * cols + x;
      tone[i] = base[i] ? clamp01(base[i] + Math.hypot(gx, gy) * EDGE * 0.15) : 0;
    }
  }
  return tone;
}

// Ordered dither: a cell lights up when its tone beats the Bayer threshold (nudged by
// jitter each frame for the shimmer), grey by tone; transparent elsewhere so CSS glow
// outlines the hands, not the box.
export function dither(out, tone, cols, rows, jitter) {
  const d = out.data;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const t = tone[i];
      const on = t > 0.04 && t > BAYER[(y & 3) * 4 + (x & 3)] * 0.9 + jitter;
      const v = on ? 110 + 145 * t : 0;
      d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v;
      d[i * 4 + 3] = on ? 255 : 0;
    }
  }
}

export default function AsciiFooter() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = SRC;

    let cols = 0;
    let rows = 0;
    let tone = new Float32Array(0); // per-cell brightness of the hands, 0 = background
    const small = document.createElement("canvas"); // one pixel per cell
    const sctx = small.getContext("2d", { willReadFrequently: true });
    let out = null;

    // Fit the image to the art box, then read one averaged pixel per cell.
    const sample = () => {
      // the canvas reaches past the art band (CSS), so rotated arms run on instead of being
      // cut flat at its edges; the hands are still sized from the band itself
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = W;
      canvas.height = H;
      const cell = W < 600 ? 2 : 3;
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      small.width = cols;
      small.height = rows;

      const phone = W < 600;
      const tilt = phone ? TILT_PHONE : TILT;
      const bandRows = footer.clientHeight / cell;
      const ratio = img.naturalHeight / img.naturalWidth;
      // desktop: cover (the box has the image's ratio, so an exact fit). phone: as long as
      // the box's span along the tilt, so the arm ends land on its edges
      const dw = phone
        ? 2 * Math.min(cols / 2 / Math.cos(tilt), bandRows / 2 / Math.sin(tilt))
        : img.naturalWidth * Math.max(cols / img.naturalWidth, bandRows / img.naturalHeight);
      const dh = dw * ratio;
      sctx.imageSmoothingQuality = "high";
      sctx.clearRect(0, 0, cols, rows);
      sctx.save();
      sctx.translate(cols / 2, rows / 2);
      sctx.rotate(tilt);
      sctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      // Tilted, the photo's ends no longer reach the screen edges, leaving gaps past the arms.
      // Continue each arm with a mirrored copy of its last 30% (seamless at the join).
      const iw = img.naturalWidth, ih = img.naturalHeight, seg = 0.3;
      sctx.scale(-1, 1); // mirrored: x' = -x
      sctx.drawImage(img, 0, 0, iw * seg, ih, dw / 2, -dh / 2, dw * seg, dh); // left end
      sctx.drawImage(img, iw * (1 - seg), 0, iw * seg, ih, -dw / 2 - dw * seg, -dh / 2, dw * seg, dh); // right end
      sctx.restore();
      const px = sctx.getImageData(0, 0, cols, rows).data;

      tone = toneOf(px, cols, rows);
      out = sctx.createImageData(cols, rows);
    };

    // dither, then scale up as hard pixels
    const frame = () => {
      dither(out, tone, cols, rows, reduce ? 0 : (Math.random() - 0.5) * 0.12);
      sctx.putImageData(out, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, canvas.width, (canvas.width / cols) * rows);
    };

    let raf = 0;
    let last = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      frame();
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // only animate while the footer is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) {
        if (!raf) raf = requestAnimationFrame(loop);
      } else stop();
    });
    const ro = new ResizeObserver(() => {
      if (!img.complete || !img.naturalWidth) return;
      sample();
      frame();
    });
    img.onload = () => {
      sample();
      frame();
      ro.observe(footer);
      io.observe(footer);
    };

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      img.onload = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-ascii" aria-hidden="true" />;
}

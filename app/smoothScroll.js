// The Lenis feel shared by every page: a long glide that lands like a spring.
// The curve starts fast (each wheel tick restarts it, so a slow start would stutter),
// runs about 8% past the target, then settles back.
// cos(2.5π·t) is 0 at t = 1, so the curve ends exactly on the target with no snap.
export const SMOOTH = {
  duration: 2,
  easing: (t) => 1 - Math.exp(-7.3 * t) * Math.cos(2.5 * Math.PI * t),
};

/**
 * Easing functions for smooth animations
 * All functions take a value t between 0 and 1
 */

export type EasingFunction = (t: number) => number;

/**
 * Linear (no easing)
 */
export const linear: EasingFunction = (t) => t;

/**
 * Quadratic easing in
 */
export const easeInQuad: EasingFunction = (t) => t * t;

/**
 * Quadratic easing out
 */
export const easeOutQuad: EasingFunction = (t) => t * (2 - t);

/**
 * Quadratic easing in/out
 */
export const easeInOutQuad: EasingFunction = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/**
 * Cubic easing in
 */
export const easeInCubic: EasingFunction = (t) => t * t * t;

/**
 * Cubic easing out
 */
export const easeOutCubic: EasingFunction = (t) => --t * t * t + 1;

/**
 * Cubic easing in/out
 */
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

/**
 * Exponential easing in
 */
export const easeInExpo: EasingFunction = (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));

/**
 * Exponential easing out
 */
export const easeOutExpo: EasingFunction = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Exponential easing in/out
 */
export const easeInOutExpo: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

/**
 * Elastic easing out
 */
export const easeOutElastic: EasingFunction = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

/**
 * Bounce easing out
 */
export const easeOutBounce: EasingFunction = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

/**
 * Smooth step (smoothstep)
 */
export const smoothStep: EasingFunction = (t) => t * t * (3 - 2 * t);

/**
 * Smoother step
 */
export const smootherStep: EasingFunction = (t) => t * t * t * (t * (t * 6 - 15) + 10);

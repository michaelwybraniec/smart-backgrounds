/**
 * Interpolation utilities
 */

import type { EasingFunction } from './easing.js';
import { linear } from './easing.js';

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Inverse linear interpolation (find t for a value between start and end)
 */
export function inverseLerp(start: number, end: number, value: number): number {
  return (value - start) / (end - start);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map value from one range to another
 */
export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Interpolate with easing function
 */
export function ease(
  start: number,
  end: number,
  t: number,
  easingFn: EasingFunction = linear
): number {
  return lerp(start, end, easingFn(t));
}

/**
 * Smooth damp (spring-like interpolation)
 */
export function smoothDamp(
  current: number,
  target: number,
  currentVelocity: number,
  smoothTime: number,
  deltaTime: number,
  maxSpeed = Infinity
): { value: number; velocity: number } {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = current - target;
  const originalTo = target;

  // Clamp maximum speed
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  target = current - change;

  const temp = (currentVelocity + omega * change) * deltaTime;
  const newVelocity = (currentVelocity - omega * temp) * exp;
  let output = target + (change + temp) * exp;

  // Prevent overshooting
  if (originalTo - current > 0 === output > originalTo) {
    output = originalTo;
    return { value: output, velocity: (output - originalTo) / deltaTime };
  }

  return { value: output, velocity: newVelocity };
}

/**
 * Normalize angle to -PI to PI range
 */
export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Shortest angle between two angles
 */
export function shortestAngle(from: number, to: number): number {
  const diff = normalizeAngle(to - from);
  return diff;
}

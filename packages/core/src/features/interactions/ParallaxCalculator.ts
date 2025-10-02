/**
 * ParallaxCalculator - Calculate parallax effects based on mouse/scroll position
 */

import type { MousePosition, ScrollPosition, ParallaxConfig } from './types.js';

export class ParallaxCalculator {
  /**
   * Calculate parallax offset from mouse position
   */
  static fromMouse(
    mouse: MousePosition,
    config: ParallaxConfig
  ): { x: number; y: number; rotation: number } {
    const { strength, inverted = false, limitX = 100, limitY = 100 } = config;

    // Center-based parallax (0,0 at center, -1 to 1 range)
    const centerX = (mouse.normalizedX - 0.5) * 2;
    const centerY = (mouse.normalizedY - 0.5) * 2;

    const multiplier = inverted ? -1 : 1;
    const x = Math.max(-limitX, Math.min(limitX, centerX * strength * limitX * multiplier));
    const y = Math.max(-limitY, Math.min(limitY, centerY * strength * limitY * multiplier));

    // Subtle rotation based on position
    const rotation = centerX * strength * 0.1 * multiplier;

    return { x, y, rotation };
  }

  /**
   * Calculate parallax offset from scroll position
   */
  static fromScroll(
    scroll: ScrollPosition,
    config: ParallaxConfig
  ): { x: number; y: number; scale: number } {
    const { strength, inverted = false } = config;

    const multiplier = inverted ? -1 : 1;
    const y = scroll.normalizedY * strength * 100 * multiplier;

    // Subtle scale effect based on scroll progress
    const scale = 1 + scroll.progress * strength * 0.1;

    return { x: 0, y, scale };
  }

  /**
   * Apply easing to parallax movement
   */
  static ease(current: number, target: number, factor = 0.1): number {
    return current + (target - current) * factor;
  }

  /**
   * Calculate velocity-based effect
   */
  static velocityEffect(velocity: number, maxVelocity = 1000): number {
    return Math.min(1, Math.abs(velocity) / maxVelocity);
  }
}

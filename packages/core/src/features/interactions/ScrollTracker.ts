/**
 * ScrollTracker - Track scroll position, direction, and velocity
 */

import type { ScrollPosition } from './types.js';

export class ScrollTracker {
  private lastScroll: { x: number; y: number; time: number } | null = null;
  private currentScroll: ScrollPosition | null = null;
  private listeners: Set<(position: ScrollPosition) => void> = new Set();
  private throttleMs: number;
  private lastEmit: number = 0;
  private rafId?: number;

  constructor(throttleMs = 16) {
    this.throttleMs = throttleMs;
  }

  /**
   * Start tracking scroll
   */
  start(): void {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  /**
   * Stop tracking
   */
  stop(): void {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /**
   * Subscribe to scroll position updates
   */
  on(callback: (position: ScrollPosition) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get current scroll position
   */
  getPosition(): ScrollPosition | null {
    return this.currentScroll;
  }

  /**
   * Handle scroll event
   */
  private handleScroll = (): void => {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      const now = performance.now();

      // Throttle updates
      if (now - this.lastEmit < this.throttleMs) {
        this.rafId = undefined;
        return;
      }

      const x = window.scrollX || window.pageXOffset;
      const y = window.scrollY || window.pageYOffset;

      const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

      const normalizedX = maxScrollX > 0 ? x / maxScrollX : 0;
      const normalizedY = maxScrollY > 0 ? y / maxScrollY : 0;
      const progress = normalizedY;

      // Calculate velocity and direction
      let velocityX = 0;
      let velocityY = 0;
      let direction: ScrollPosition['direction'] = 'none';

      if (this.lastScroll) {
        const deltaTime = now - this.lastScroll.time;
        if (deltaTime > 0) {
          velocityX = ((x - this.lastScroll.x) / deltaTime) * 1000; // px/s
          velocityY = ((y - this.lastScroll.y) / deltaTime) * 1000;

          // Determine direction
          if (Math.abs(velocityY) > Math.abs(velocityX)) {
            direction = velocityY > 0 ? 'down' : 'up';
          } else if (Math.abs(velocityX) > 0) {
            direction = velocityX > 0 ? 'right' : 'left';
          }
        }
      }

      this.currentScroll = {
        x,
        y,
        normalizedX,
        normalizedY,
        velocityX,
        velocityY,
        direction,
        progress,
        timestamp: now,
      };

      this.lastScroll = { x, y, time: now };
      this.lastEmit = now;
      this.rafId = undefined;

      // Emit to listeners
      this.emit(this.currentScroll);
    });
  };

  /**
   * Emit position to all listeners
   */
  private emit(position: ScrollPosition): void {
    for (const listener of this.listeners) {
      listener(position);
    }
  }
}

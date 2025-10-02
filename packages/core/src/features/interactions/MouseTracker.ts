/**
 * MouseTracker - Track cursor position, velocity, and direction
 */

import type { MousePosition } from './types.js';

export class MouseTracker {
  private lastPosition: { x: number; y: number; time: number } | null = null;
  private currentPosition: MousePosition | null = null;
  private listeners: Set<(position: MousePosition) => void> = new Set();
  private rafId?: number;
  private throttleMs: number;
  private lastEmit: number = 0;

  constructor(throttleMs = 16) {
    // 16ms = ~60fps
    this.throttleMs = throttleMs;
  }

  /**
   * Start tracking mouse movement
   */
  start(): void {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseenter', this.handleMouseEnter);
    window.addEventListener('mouseleave', this.handleMouseLeave);
  }

  /**
   * Stop tracking
   */
  stop(): void {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseenter', this.handleMouseEnter);
    window.removeEventListener('mouseleave', this.handleMouseLeave);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /**
   * Subscribe to mouse position updates
   */
  on(callback: (position: MousePosition) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get current mouse position
   */
  getPosition(): MousePosition | null {
    return this.currentPosition;
  }

  /**
   * Handle mouse move event
   */
  private handleMouseMove = (event: MouseEvent): void => {
    const now = performance.now();

    // Throttle updates
    if (now - this.lastEmit < this.throttleMs) {
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;

    // Calculate velocity
    let velocityX = 0;
    let velocityY = 0;
    let speed = 0;
    let direction = 0;

    if (this.lastPosition) {
      const deltaTime = now - this.lastPosition.time;
      if (deltaTime > 0) {
        velocityX = ((x - this.lastPosition.x) / deltaTime) * 1000; // px/s
        velocityY = ((y - this.lastPosition.y) / deltaTime) * 1000;
        speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        direction = Math.atan2(velocityY, velocityX);
      }
    }

    this.currentPosition = {
      x,
      y,
      normalizedX,
      normalizedY,
      velocityX,
      velocityY,
      speed,
      direction,
      timestamp: now,
    };

    this.lastPosition = { x, y, time: now };
    this.lastEmit = now;

    // Emit to listeners
    this.emit(this.currentPosition);
  };

  /**
   * Handle mouse enter
   */
  private handleMouseEnter = (): void => {
    // Mouse entered viewport
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = (): void => {
    // Mouse left viewport - reset velocity
    if (this.currentPosition) {
      this.currentPosition = {
        ...this.currentPosition,
        velocityX: 0,
        velocityY: 0,
        speed: 0,
      };
      this.emit(this.currentPosition);
    }
    this.lastPosition = null;
  };

  /**
   * Emit position to all listeners
   */
  private emit(position: MousePosition): void {
    for (const listener of this.listeners) {
      listener(position);
    }
  }
}

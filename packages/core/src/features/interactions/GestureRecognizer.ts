/**
 * GestureRecognizer - Recognize touch gestures (swipe, pinch, tap, etc.)
 */

import type { Gesture, GestureType } from './types.js';

interface Touch {
  id: number;
  x: number;
  y: number;
  time: number;
}

export class GestureRecognizer {
  private touches: Map<number, Touch> = new Map();
  private listeners: Map<GestureType, Set<(gesture: Gesture) => void>> = new Map();
  private tapTimeout?: ReturnType<typeof setTimeout>;
  private enabledGestures: Set<GestureType>;

  constructor(gestures: GestureType[] = ['tap', 'swipe', 'pinch', 'pan']) {
    this.enabledGestures = new Set(gestures);
  }

  /**
   * Start recognizing gestures
   */
  start(): void {
    window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', this.handleTouchCancel);
  }

  /**
   * Stop recognizing gestures
   */
  stop(): void {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('touchcancel', this.handleTouchCancel);
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }
  }

  /**
   * Subscribe to gesture events
   */
  on(type: GestureType, callback: (gesture: Gesture) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(callback);
    return () => this.listeners.get(type)?.delete(callback);
  }

  /**
   * Handle touch start
   */
  private handleTouchStart = (event: TouchEvent): void => {
    const now = performance.now();

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      if (touch) {
        this.touches.set(touch.identifier, {
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
          time: now,
        });
      }
    }

    // Detect tap gesture
    if (this.enabledGestures.has('tap') && this.touches.size === 1) {
      const touch = Array.from(this.touches.values())[0];
      if (touch) {
        this.tapTimeout = setTimeout(() => {
          // If still only one touch after 300ms, it's not a tap
          this.tapTimeout = undefined;
        }, 300);
      }
    }
  };

  /**
   * Handle touch move
   */
  private handleTouchMove = (event: TouchEvent): void => {
    const now = performance.now();

    // Update touch positions
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      if (touch) {
        const startTouch = this.touches.get(touch.identifier);
        if (startTouch) {
          const deltaX = touch.clientX - startTouch.x;
          const deltaY = touch.clientY - startTouch.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX);
          const deltaTime = now - startTouch.time;
          const velocity = deltaTime > 0 ? (distance / deltaTime) * 1000 : 0;

          // Pan gesture
          if (this.enabledGestures.has('pan') && this.touches.size === 1) {
            const gesture: Gesture = {
              type: 'pan',
              startX: startTouch.x,
              startY: startTouch.y,
              currentX: touch.clientX,
              currentY: touch.clientY,
              deltaX,
              deltaY,
              distance,
              angle,
              velocity,
              timestamp: now,
            };
            this.emit('pan', gesture);
          }

          // Pinch gesture
          if (this.enabledGestures.has('pinch') && this.touches.size === 2) {
            const touches = Array.from(this.touches.values());
            const touch1 = touches[0];
            const touch2 = touches[1];
            if (touch1 && touch2) {
              const currentDistance = Math.sqrt(
                Math.pow(touch.clientX - touch2.x, 2) + Math.pow(touch.clientY - touch2.y, 2)
              );
              const startDistance = Math.sqrt(
                Math.pow(touch1.x - touch2.x, 2) + Math.pow(touch1.y - touch2.y, 2)
              );
              const scale = currentDistance / startDistance;

              const gesture: Gesture = {
                type: 'pinch',
                startX: (touch1.x + touch2.x) / 2,
                startY: (touch1.y + touch2.y) / 2,
                currentX: (touch.clientX + touch2.x) / 2,
                currentY: (touch.clientY + touch2.y) / 2,
                deltaX: 0,
                deltaY: 0,
                distance: currentDistance,
                angle: 0,
                scale,
                velocity: 0,
                timestamp: now,
              };
              this.emit('pinch', gesture);
            }
          }
        }
      }
    }
  };

  /**
   * Handle touch end
   */
  private handleTouchEnd = (event: TouchEvent): void => {
    const now = performance.now();

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      if (touch) {
        const startTouch = this.touches.get(touch.identifier);
        if (startTouch) {
          const deltaX = touch.clientX - startTouch.x;
          const deltaY = touch.clientY - startTouch.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX);
          const deltaTime = now - startTouch.time;
          const velocity = deltaTime > 0 ? (distance / deltaTime) * 1000 : 0;

          // Tap gesture
          if (
            this.enabledGestures.has('tap') &&
            distance < 10 &&
            deltaTime < 300 &&
            this.tapTimeout
          ) {
            const gesture: Gesture = {
              type: 'tap',
              startX: startTouch.x,
              startY: startTouch.y,
              currentX: touch.clientX,
              currentY: touch.clientY,
              deltaX: 0,
              deltaY: 0,
              distance: 0,
              angle: 0,
              velocity: 0,
              timestamp: now,
            };
            this.emit('tap', gesture);
          }

          // Swipe gesture
          if (this.enabledGestures.has('swipe') && distance > 50 && velocity > 300) {
            const gesture: Gesture = {
              type: 'swipe',
              startX: startTouch.x,
              startY: startTouch.y,
              currentX: touch.clientX,
              currentY: touch.clientY,
              deltaX,
              deltaY,
              distance,
              angle,
              velocity,
              timestamp: now,
            };
            this.emit('swipe', gesture);
          }

          this.touches.delete(touch.identifier);
        }
      }
    }

    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
      this.tapTimeout = undefined;
    }
  };

  /**
   * Handle touch cancel
   */
  private handleTouchCancel = (): void => {
    this.touches.clear();
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
      this.tapTimeout = undefined;
    }
  };

  /**
   * Emit gesture to listeners
   */
  private emit(type: GestureType, gesture: Gesture): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      for (const listener of listeners) {
        listener(gesture);
      }
    }
  }
}

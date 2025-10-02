/**
 * Interaction feature types
 */

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // 0-1
  normalizedY: number; // 0-1
  velocityX: number;
  velocityY: number;
  speed: number;
  direction: number; // angle in radians
  timestamp: number;
}

export interface ScrollPosition {
  x: number;
  y: number;
  normalizedX: number; // 0-1
  normalizedY: number; // 0-1
  velocityX: number;
  velocityY: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
  progress: number; // 0-1 based on page height
  timestamp: number;
}

export type GestureType = 'tap' | 'swipe' | 'pinch' | 'rotate' | 'pan';

export interface Gesture {
  type: GestureType;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  angle: number;
  scale?: number; // for pinch
  rotation?: number; // for rotate
  velocity: number;
  timestamp: number;
}

export interface InteractionConfig {
  enabled?: boolean;
  mouse?: {
    enabled?: boolean;
    throttle?: number; // ms
    parallax?: boolean;
  };
  scroll?: {
    enabled?: boolean;
    throttle?: number; // ms
    smooth?: boolean;
  };
  touch?: {
    enabled?: boolean;
    gestures?: GestureType[];
  };
  keyboard?: {
    enabled?: boolean;
  };
}

export interface ParallaxConfig {
  strength: number; // 0-1
  inverted?: boolean;
  limitX?: number;
  limitY?: number;
}

export interface InteractionState {
  mouse?: MousePosition;
  scroll?: ScrollPosition;
  gesture?: Gesture;
  isMouseActive: boolean;
  isScrolling: boolean;
  isTouching: boolean;
}

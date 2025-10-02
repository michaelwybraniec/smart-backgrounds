/**
 * UserBehaviorFeature - Smart Feature #2
 * Track and respond to user interactions (mouse, scroll, touch gestures)
 */

import type { Feature, FeatureContext } from '../../types.js';
import { MouseTracker } from './MouseTracker.js';
import { ScrollTracker } from './ScrollTracker.js';
import { GestureRecognizer } from './GestureRecognizer.js';
import { ParallaxCalculator } from './ParallaxCalculator.js';
import type {
  InteractionConfig,
  InteractionState,
  MousePosition,
  ScrollPosition,
  Gesture,
} from './types.js';

export class UserBehaviorFeature implements Feature {
  name = 'user-behavior';
  version = '1.0.0';
  dependencies = [];

  private mouseTracker: MouseTracker;
  private scrollTracker: ScrollTracker;
  private gestureRecognizer: GestureRecognizer;
  private context?: FeatureContext;
  private config: Required<InteractionConfig>;
  private state: InteractionState;

  constructor(config: InteractionConfig = {}) {
    this.config = {
      enabled: true,
      mouse: {
        enabled: true,
        throttle: 16,
        parallax: true,
        ...config.mouse,
      },
      scroll: {
        enabled: true,
        throttle: 16,
        smooth: true,
        ...config.scroll,
      },
      touch: {
        enabled: true,
        gestures: ['tap', 'swipe', 'pinch', 'pan'],
        ...config.touch,
      },
      keyboard: {
        enabled: false,
        ...config.keyboard,
      },
    };

    this.mouseTracker = new MouseTracker(this.config.mouse.throttle);
    this.scrollTracker = new ScrollTracker(this.config.scroll.throttle);
    this.gestureRecognizer = new GestureRecognizer(this.config.touch.gestures);

    this.state = {
      isMouseActive: false,
      isScrolling: false,
      isTouching: false,
    };
  }

  /**
   * Initialize user behavior feature
   */
  async init(context: FeatureContext): Promise<void> {
    this.context = context;

    // Start mouse tracking
    if (this.config.mouse.enabled) {
      this.mouseTracker.start();
      this.mouseTracker.on(this.handleMouseUpdate);
      this.state.isMouseActive = true;
    }

    // Start scroll tracking
    if (this.config.scroll.enabled) {
      this.scrollTracker.start();
      this.scrollTracker.on(this.handleScrollUpdate);
    }

    // Start gesture recognition
    if (this.config.touch.enabled) {
      this.gestureRecognizer.start();
      for (const gesture of this.config.touch.gestures ?? []) {
        this.gestureRecognizer.on(gesture, this.handleGesture);
      }
    }

    // Emit initialization complete
    await context.eventBus.emit('interactions:initialized', {
      config: this.config,
    });
  }

  /**
   * Destroy user behavior feature
   */
  async destroy(): Promise<void> {
    this.mouseTracker.stop();
    this.scrollTracker.stop();
    this.gestureRecognizer.stop();

    if (this.context) {
      await this.context.eventBus.emit('interactions:destroyed');
    }
  }

  /**
   * Get current interaction state
   */
  getState(): InteractionState {
    return { ...this.state };
  }

  /**
   * Get mouse position
   */
  getMousePosition(): MousePosition | null {
    return this.mouseTracker.getPosition();
  }

  /**
   * Get scroll position
   */
  getScrollPosition(): ScrollPosition | null {
    return this.scrollTracker.getPosition();
  }

  /**
   * Calculate parallax from mouse
   */
  calculateMouseParallax(
    strength = 0.5,
    inverted = false
  ): { x: number; y: number; rotation: number } | null {
    const mouse = this.mouseTracker.getPosition();
    if (!mouse) return null;

    return ParallaxCalculator.fromMouse(mouse, {
      strength,
      inverted,
      limitX: 100,
      limitY: 100,
    });
  }

  /**
   * Calculate parallax from scroll
   */
  calculateScrollParallax(
    strength = 0.5,
    inverted = false
  ): { x: number; y: number; scale: number } | null {
    const scroll = this.scrollTracker.getPosition();
    if (!scroll) return null;

    return ParallaxCalculator.fromScroll(scroll, {
      strength,
      inverted,
    });
  }

  /**
   * Handle mouse update
   */
  private handleMouseUpdate = (position: MousePosition): void => {
    this.state.mouse = position;

    if (this.context) {
      void this.context.eventBus.emit('interactions:mouse', position);

      // Emit parallax data if enabled
      if (this.config.mouse.parallax) {
        const parallax = ParallaxCalculator.fromMouse(position, {
          strength: 0.5,
          limitX: 100,
          limitY: 100,
        });
        void this.context.eventBus.emit('interactions:parallax:mouse', parallax);
      }
    }
  };

  /**
   * Handle scroll update
   */
  private handleScrollUpdate = (position: ScrollPosition): void => {
    this.state.scroll = position;
    this.state.isScrolling = Math.abs(position.velocityY) > 0;

    if (this.context) {
      void this.context.eventBus.emit('interactions:scroll', position);

      // Emit parallax data
      const parallax = ParallaxCalculator.fromScroll(position, {
        strength: 0.3,
      });
      void this.context.eventBus.emit('interactions:parallax:scroll', parallax);
    }

    // Reset scrolling state after delay
    setTimeout(() => {
      this.state.isScrolling = false;
    }, 150);
  };

  /**
   * Handle gesture
   */
  private handleGesture = (gesture: Gesture): void => {
    this.state.gesture = gesture;
    this.state.isTouching = true;

    if (this.context) {
      void this.context.eventBus.emit('interactions:gesture', gesture);
      void this.context.eventBus.emit(`interactions:gesture:${gesture.type}`, gesture);
    }

    // Reset touch state after delay
    setTimeout(() => {
      this.state.isTouching = false;
    }, 100);
  };
}

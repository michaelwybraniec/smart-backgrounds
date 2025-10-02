/**
 * EventBus - Event-driven communication system
 * Provides pub/sub pattern for loose coupling between features
 */

import type { EventBusInterface, EventHandler } from './types.js';

export class EventBus implements EventBusInterface {
  private handlers: Map<string, Set<EventHandler>>;
  private onceHandlers: WeakMap<EventHandler, EventHandler>;

  constructor() {
    this.handlers = new Map();
    this.onceHandlers = new WeakMap();
  }

  /**
   * Subscribe to an event
   * @param event - Event name
   * @param handler - Event handler function
   * @returns Unsubscribe function
   */
  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.add(handler as EventHandler);
    }

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param handler - Event handler function
   */
  off<T = unknown>(event: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Emit an event
   * @param event - Event name
   * @param data - Event data
   */
  async emit<T = unknown>(event: string, data?: T): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers || handlers.size === 0) {
      return;
    }

    // Execute all handlers
    const promises: Promise<void>[] = [];
    for (const handler of handlers) {
      try {
        const result = handler(data);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    }

    // Wait for all async handlers
    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first emit)
   * @param event - Event name
   * @param handler - Event handler function
   * @returns Unsubscribe function
   */
  once<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    const onceWrapper: EventHandler<T> = (data) => {
      const result = handler(data);
      // Handle promise rejection
      if (result instanceof Promise) {
        void result.catch((error) => {
          console.error(`Error in once handler for "${event}":`, error);
        });
      }
      this.off(event, onceWrapper);
    };

    // Store reference for manual unsubscribe
    this.onceHandlers.set(handler as EventHandler, onceWrapper as EventHandler);

    return this.on(event, onceWrapper);
  }

  /**
   * Clear all event handlers
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Get number of handlers for an event (for debugging)
   */
  getHandlerCount(event: string): number {
    return this.handlers.get(event)?.size ?? 0;
  }

  /**
   * Get all registered events (for debugging)
   */
  getEvents(): string[] {
    return Array.from(this.handlers.keys());
  }
}

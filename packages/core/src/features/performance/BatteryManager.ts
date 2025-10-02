/**
 * BatteryManager - Battery Status API integration
 * Reduces performance when battery is low to save power
 */

import type { BatteryStatus } from './types.js';

interface BatteryManagerAPI {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

export class BatteryManager {
  private battery?: BatteryManagerAPI;
  private listeners: Map<string, Set<(status: BatteryStatus) => void>>;
  private supported: boolean;

  constructor() {
    this.listeners = new Map();
    this.supported = 'getBattery' in navigator;
  }

  /**
   * Initialize battery monitoring
   */
  async init(): Promise<void> {
    if (!this.supported) {
      // eslint-disable-next-line no-console
      console.warn('Battery Status API is not supported');
      return;
    }

    try {
      // @ts-expect-error - getBattery is not in standard types
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.battery = (await navigator.getBattery()) as BatteryManagerAPI;
      this.setupListeners();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize Battery Manager:', error);
      this.supported = false;
    }
  }

  /**
   * Get current battery status
   */
  getStatus(): BatteryStatus | null {
    if (!this.battery) return null;

    return {
      level: this.battery.level,
      charging: this.battery.charging,
      chargingTime: this.battery.chargingTime,
      dischargingTime: this.battery.dischargingTime,
    };
  }

  /**
   * Check if battery is low (below threshold)
   */
  isLowBattery(threshold = 0.2): boolean {
    const status = this.getStatus();
    if (!status) return false;
    return !status.charging && status.level < threshold;
  }

  /**
   * Check if battery is supported
   */
  isSupported(): boolean {
    return this.supported;
  }

  /**
   * Subscribe to battery status changes
   */
  on(event: 'change' | 'low', callback: (status: BatteryStatus) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from battery status changes
   */
  off(event: 'change' | 'low', callback: (status: BatteryStatus) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.battery) {
      this.battery.removeEventListener('levelchange', this.handleChange);
      this.battery.removeEventListener('chargingchange', this.handleChange);
    }
    this.listeners.clear();
  }

  /**
   * Setup battery event listeners
   */
  private setupListeners(): void {
    if (!this.battery) return;

    this.battery.addEventListener('levelchange', this.handleChange);
    this.battery.addEventListener('chargingchange', this.handleChange);
  }

  /**
   * Handle battery status change
   */
  private handleChange = (): void => {
    const status = this.getStatus();
    if (!status) return;

    // Emit change event
    const changeListeners = this.listeners.get('change');
    if (changeListeners) {
      for (const callback of changeListeners) {
        callback(status);
      }
    }

    // Emit low battery event
    if (this.isLowBattery()) {
      const lowListeners = this.listeners.get('low');
      if (lowListeners) {
        for (const callback of lowListeners) {
          callback(status);
        }
      }
    }
  };
}

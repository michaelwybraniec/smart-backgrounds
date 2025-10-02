/**
 * PerformanceMonitor - FPS tracking and performance metrics
 * Uses Web Performance API for accurate measurements
 */

import type { PerformanceMetrics } from './types.js';

export class PerformanceMonitor {
  private frameCount: number;
  private lastTime: number;
  private fpsHistory: number[];
  private maxHistoryLength: number;
  private rafId?: number;
  private callback?: (metrics: PerformanceMetrics) => void;

  constructor(maxHistoryLength = 60) {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.maxHistoryLength = maxHistoryLength;
  }

  /**
   * Start monitoring performance
   * @param callback - Called on each measurement with metrics
   */
  start(callback: (metrics: PerformanceMetrics) => void): void {
    this.callback = callback;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.loop();
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    this.callback = undefined;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    const fps = this.getCurrentFPS();
    const avgFps = this.getAverageFPS();

    return {
      fps,
      avgFps,
      minFps: Math.min(...this.fpsHistory, fps),
      maxFps: Math.max(...this.fpsHistory, fps),
      frameTime: fps > 0 ? 1000 / fps : 0,
      memoryUsage: this.getMemoryUsage(),
      timestamp: performance.now(),
    };
  }

  /**
   * Main monitoring loop
   */
  private loop = (): void => {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    this.frameCount++;

    // Calculate FPS every ~100ms
    if (deltaTime >= 100) {
      const fps = Math.round((this.frameCount / deltaTime) * 1000);

      // Update history
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }

      // Emit metrics
      if (this.callback) {
        this.callback(this.getMetrics());
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  /**
   * Get current FPS
   */
  private getCurrentFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory[this.fpsHistory.length - 1] ?? 60;
  }

  /**
   * Get average FPS from history
   */
  private getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  /**
   * Get memory usage if available
   */
  private getMemoryUsage(): number | undefined {
    // @ts-expect-error - memory property may not exist
    const memory = performance.memory as
      | { usedJSHeapSize: number; jsHeapSizeLimit: number }
      | undefined;

    if (memory) {
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return undefined;
  }

  /**
   * Check if performance is degraded
   */
  isPerformanceDegraded(threshold = 50): boolean {
    const avgFps = this.getAverageFPS();
    return avgFps < threshold;
  }
}

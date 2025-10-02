/**
 * AdaptiveQuality - Dynamic quality adjustment system
 * Automatically adjusts quality based on FPS to maintain target
 */

import type { QualityLevel, PerformanceMetrics, QualitySettings } from './types.js';

export interface AdaptiveQualityConfig {
  targetFPS: number;
  adjustmentDelay: number; // ms before adjusting
  fpsThreshold: {
    high: number; // FPS above this = high quality
    medium: number; // FPS above this = medium quality
    low: number; // FPS above this = low quality
    // Below low = minimal quality
  };
}

export class AdaptiveQuality {
  private currentQuality: QualityLevel;
  private config: AdaptiveQualityConfig;
  private lastAdjustment: number;
  private fpsHistory: number[];
  private callback?: (quality: QualityLevel, settings: QualitySettings) => void;

  private qualitySettings: Record<QualityLevel, QualitySettings> = {
    high: {
      particleCount: 10000,
      resolution: 1.0,
      shadowQuality: 'high',
      antialiasing: true,
      postProcessing: true,
    },
    medium: {
      particleCount: 5000,
      resolution: 0.75,
      shadowQuality: 'medium',
      antialiasing: true,
      postProcessing: false,
    },
    low: {
      particleCount: 2000,
      resolution: 0.5,
      shadowQuality: 'low',
      antialiasing: false,
      postProcessing: false,
    },
    minimal: {
      particleCount: 500,
      resolution: 0.25,
      shadowQuality: 'off',
      antialiasing: false,
      postProcessing: false,
    },
  };

  constructor(config?: Partial<AdaptiveQualityConfig>) {
    this.config = {
      targetFPS: 60,
      adjustmentDelay: 200,
      fpsThreshold: {
        high: 58,
        medium: 45,
        low: 30,
      },
      ...config,
    };

    this.currentQuality = 'high';
    this.lastAdjustment = 0;
    this.fpsHistory = [];
  }

  /**
   * Process performance metrics and adjust quality if needed
   */
  processMetrics(metrics: PerformanceMetrics): void {
    const now = performance.now();

    // Track FPS history
    this.fpsHistory.push(metrics.avgFps);
    if (this.fpsHistory.length > 10) {
      this.fpsHistory.shift();
    }

    // Check if enough time has passed since last adjustment
    if (now - this.lastAdjustment < this.config.adjustmentDelay) {
      return;
    }

    // Calculate average FPS from recent history
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    // Determine target quality based on FPS
    const targetQuality = this.determineQuality(avgFps);

    // Adjust if needed
    if (targetQuality !== this.currentQuality) {
      this.adjustQuality(targetQuality);
      this.lastAdjustment = now;
    }
  }

  /**
   * Manually set quality level
   */
  setQuality(quality: QualityLevel): void {
    if (quality !== this.currentQuality) {
      this.adjustQuality(quality);
    }
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): QualityLevel {
    return this.currentQuality;
  }

  /**
   * Get quality settings for a level
   */
  getQualitySettings(quality?: QualityLevel): QualitySettings {
    return this.qualitySettings[quality ?? this.currentQuality];
  }

  /**
   * Set custom quality settings
   */
  setQualitySettings(quality: QualityLevel, settings: Partial<QualitySettings>): void {
    this.qualitySettings[quality] = {
      ...this.qualitySettings[quality],
      ...settings,
    };
  }

  /**
   * Subscribe to quality changes
   */
  onChange(callback: (quality: QualityLevel, settings: QualitySettings) => void): void {
    this.callback = callback;
  }

  /**
   * Determine quality level based on FPS
   */
  private determineQuality(fps: number): QualityLevel {
    const { fpsThreshold } = this.config;

    if (fps >= fpsThreshold.high) {
      return 'high';
    } else if (fps >= fpsThreshold.medium) {
      return 'medium';
    } else if (fps >= fpsThreshold.low) {
      return 'low';
    } else {
      return 'minimal';
    }
  }

  /**
   * Adjust quality to target level
   */
  private adjustQuality(targetQuality: QualityLevel): void {
    const previousQuality = this.currentQuality;
    this.currentQuality = targetQuality;

    const settings = this.getQualitySettings(targetQuality);

    // eslint-disable-next-line no-console
    console.log(`[AdaptiveQuality] Adjusted: ${previousQuality} → ${targetQuality}`, settings);

    // Emit change event
    if (this.callback) {
      this.callback(targetQuality, settings);
    }
  }

  /**
   * Reset to default quality
   */
  reset(): void {
    this.currentQuality = 'high';
    this.fpsHistory = [];
    this.lastAdjustment = 0;
  }
}

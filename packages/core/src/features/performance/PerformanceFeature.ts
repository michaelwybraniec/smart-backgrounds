/**
 * PerformanceFeature - Smart Feature #1
 * Auto-detects device capabilities and dynamically adjusts quality to maintain 60 FPS
 */

import type { Feature, FeatureContext } from '../../types.js';
import { PerformanceMonitor } from './PerformanceMonitor.js';
import { AdaptiveQuality } from './AdaptiveQuality.js';
import { GPUDetector } from './GPUDetector.js';
import { BatteryManager } from './BatteryManager.js';
import type { PerformanceConfig, PerformanceState, QualityLevel } from './types.js';

export class PerformanceFeature implements Feature {
  name = 'performance';
  version = '1.0.0';
  dependencies = [];

  private monitor: PerformanceMonitor;
  private adaptiveQuality: AdaptiveQuality;
  private batteryManager: BatteryManager;
  private context?: FeatureContext;
  private config: PerformanceConfig;
  private state: PerformanceState;
  private visibilityHandler?: () => void;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enabled: true,
      targetFPS: 60,
      adaptiveQuality: true,
      batteryAware: true,
      pauseOnHidden: true,
      showStats: false,
      ...config,
    };

    this.monitor = new PerformanceMonitor();
    this.adaptiveQuality = new AdaptiveQuality({
      targetFPS: this.config.targetFPS,
    });
    this.batteryManager = new BatteryManager();

    this.state = {
      currentQuality: 'high',
      metrics: {
        fps: 60,
        avgFps: 60,
        minFps: 60,
        maxFps: 60,
        frameTime: 16.67,
        timestamp: 0,
      },
      isTabVisible: true,
      isPaused: false,
    };
  }

  /**
   * Initialize performance feature
   */
  async init(context: FeatureContext): Promise<void> {
    this.context = context;

    // Detect GPU capabilities
    const gpuCapabilities = GPUDetector.detect();
    if (gpuCapabilities) {
      this.state.gpuCapabilities = gpuCapabilities;
      // eslint-disable-next-line no-console
      console.log('[PerformanceFeature] GPU detected:', gpuCapabilities);

      // Set initial quality based on GPU tier
      if (gpuCapabilities.tier) {
        this.setInitialQuality(gpuCapabilities.tier);
      }
    }

    // Initialize battery monitoring
    if (this.config.batteryAware) {
      await this.batteryManager.init();
      const batteryStatus = this.batteryManager.getStatus();
      if (batteryStatus) {
        this.state.batteryStatus = batteryStatus;
      }

      // Listen for low battery
      this.batteryManager.on('low', (status) => {
        // eslint-disable-next-line no-console
        console.log('[PerformanceFeature] Low battery detected, reducing quality');
        this.adaptiveQuality.setQuality('low');
        void context.eventBus.emit('performance:battery-low', status);
      });
    }

    // Setup adaptive quality callback
    if (this.config.adaptiveQuality) {
      this.adaptiveQuality.onChange((quality, settings) => {
        this.state.currentQuality = quality;
        void context.eventBus.emit('performance:quality-changed', {
          quality,
          settings,
        });
      });
    }

    // Start performance monitoring
    this.monitor.start((metrics) => {
      this.state.metrics = metrics;

      // Emit metrics event
      void context.eventBus.emit('performance:metrics', metrics);

      // Process metrics for adaptive quality
      if (this.config.adaptiveQuality && !this.state.isPaused) {
        this.adaptiveQuality.processMetrics(metrics);
      }

      // Show stats if enabled
      if (this.config.showStats) {
        this.showStats(metrics);
      }
    });

    // Setup tab visibility detection
    if (this.config.pauseOnHidden) {
      this.setupVisibilityDetection();
    }

    // Emit initialization complete
    void context.eventBus.emit('performance:initialized', {
      gpuCapabilities,
      batterySupported: this.batteryManager.isSupported(),
      config: this.config,
    });
  }

  /**
   * Destroy performance feature
   */
  async destroy(): Promise<void> {
    this.monitor.stop();
    this.batteryManager.destroy();

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }

    if (this.context) {
      await this.context.eventBus.emit('performance:destroyed');
    }
  }

  /**
   * Get current performance state
   */
  getState(): PerformanceState {
    return { ...this.state };
  }

  /**
   * Manually set quality level
   */
  setQuality(quality: PerformanceState['currentQuality']): void {
    this.adaptiveQuality.setQuality(quality);
  }

  /**
   * Get GPU capabilities
   */
  getGPUCapabilities(): PerformanceState['gpuCapabilities'] {
    return this.state.gpuCapabilities;
  }

  /**
   * Set initial quality based on GPU tier
   */
  private setInitialQuality(tier: 'high' | 'medium' | 'low' | 'minimal'): void {
    const qualityMap: Record<typeof tier, QualityLevel> = {
      high: 'high',
      medium: 'medium',
      low: 'low',
      minimal: 'minimal',
    };

    const quality = qualityMap[tier];
    this.adaptiveQuality.setQuality(quality);
    this.state.currentQuality = quality;
  }

  /**
   * Setup tab visibility detection
   */
  private setupVisibilityDetection(): void {
    this.visibilityHandler = () => {
      const isVisible = document.visibilityState === 'visible';
      this.state.isTabVisible = isVisible;

      if (isVisible) {
        // Resume
        this.state.isPaused = false;
        if (this.context) {
          void this.context.eventBus.emit('performance:resumed');
        }
      } else {
        // Pause
        this.state.isPaused = true;
        if (this.context) {
          void this.context.eventBus.emit('performance:paused');
        }
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  /**
   * Show performance stats (for debugging)
   */
  private showStats(metrics: PerformanceState['metrics']): void {
    const statsDiv = this.getOrCreateStatsDiv();
    statsDiv.innerHTML = `
      <div style="font-family: monospace; font-size: 10px; line-height: 1.5;">
        <div>FPS: ${metrics.fps.toFixed(1)}</div>
        <div>Avg: ${metrics.avgFps.toFixed(1)}</div>
        <div>Min: ${metrics.minFps.toFixed(1)}</div>
        <div>Max: ${metrics.maxFps.toFixed(1)}</div>
        <div>Quality: ${this.state.currentQuality}</div>
        ${metrics.memoryUsage ? `<div>Memory: ${(metrics.memoryUsage * 100).toFixed(1)}%</div>` : ''}
      </div>
    `;
  }

  /**
   * Get or create stats display element
   */
  private getOrCreateStatsDiv(): HTMLDivElement {
    let statsDiv = document.getElementById('smart-bg-stats') as HTMLDivElement;

    if (!statsDiv) {
      statsDiv = document.createElement('div');
      statsDiv.id = 'smart-bg-stats';
      statsDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #0f0;
        padding: 10px;
        border-radius: 4px;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(statsDiv);
    }

    return statsDiv;
  }
}

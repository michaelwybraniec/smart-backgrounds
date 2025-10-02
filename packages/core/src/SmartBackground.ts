/**
 * SmartBackground - Main entry point and API facade
 * Orchestrates all 29 smart features with clean, simple API
 */

import { EventBus } from './EventBus.js';
import { FeatureManager } from './FeatureManager.js';
import type {
  SmartBackgroundConfig,
  SmartBackgroundInterface,
  Feature,
  FeatureContext,
} from './types.js';

export class SmartBackground implements SmartBackgroundInterface {
  private config: SmartBackgroundConfig;
  private eventBus: EventBus;
  private featureManager: FeatureManager;
  private container?: HTMLElement;
  private mounted: boolean;

  constructor(config: SmartBackgroundConfig = {}) {
    this.config = config;
    this.eventBus = new EventBus();
    this.featureManager = new FeatureManager();
    this.mounted = false;

    // Initialize features from config
    this.initializeFeatures();
  }

  /**
   * Mount the background to a container
   * @param container - DOM element or selector
   */
  async mount(container: HTMLElement | string): Promise<void> {
    if (this.mounted) {
      console.warn('SmartBackground is already mounted');
      return;
    }

    // Resolve container
    this.container =
      typeof container === 'string' ? (document.querySelector(container) ?? undefined) : container;

    if (!this.container) {
      throw new Error(`Container not found: ${String(container)}`);
    }

    // Initialize all features
    const context: FeatureContext = {
      eventBus: this.eventBus,
      config: this.config.features ?? {},
      container: this.container,
    };

    await this.featureManager.init(context);
    this.mounted = true;

    // Emit mounted event
    await this.eventBus.emit('background:mounted', {
      container: this.container,
      config: this.config,
    });
  }

  /**
   * Unmount the background
   */
  async unmount(): Promise<void> {
    if (!this.mounted) {
      console.warn('SmartBackground is not mounted');
      return;
    }

    // Emit unmounting event
    await this.eventBus.emit('background:unmounting');

    // Destroy all features
    await this.featureManager.destroy();

    this.mounted = false;
    this.container = undefined;

    // Emit unmounted event
    await this.eventBus.emit('background:unmounted');
  }

  /**
   * Update configuration
   * @param config - Partial config to merge
   */
  async update(config: Partial<SmartBackgroundConfig>): Promise<void> {
    const oldConfig = this.config;
    this.config = { ...this.config, ...config };

    // Emit config updated event
    await this.eventBus.emit('background:config-updated', {
      oldConfig,
      newConfig: this.config,
      changes: config,
    });
  }

  /**
   * Get a registered feature
   * @param name - Feature name
   * @returns Feature or undefined
   */
  getFeature(name: string): Feature | undefined {
    return this.featureManager.get(name);
  }

  /**
   * Destroy the background instance
   */
  async destroy(): Promise<void> {
    if (this.mounted) {
      await this.unmount();
    }

    this.eventBus.clear();
    await this.featureManager.destroy();

    // Emit destroyed event
    await this.eventBus.emit('background:destroyed');
  }

  /**
   * Get the event bus instance (for advanced usage)
   */
  getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Get the feature manager instance (for advanced usage)
   */
  getFeatureManager(): FeatureManager {
    return this.featureManager;
  }

  /**
   * Check if mounted
   */
  isMounted(): boolean {
    return this.mounted;
  }

  /**
   * Get current configuration
   */
  getConfig(): SmartBackgroundConfig {
    return { ...this.config };
  }

  /**
   * Initialize features from configuration
   * This is called internally during construction
   */
  private initializeFeatures(): void {
    // Features will be registered externally via plugins
    // This method is reserved for future automatic feature loading
  }
}

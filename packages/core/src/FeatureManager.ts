/**
 * FeatureManager - Plugin system for managing smart features
 * Handles feature lifecycle, dependencies, and initialization
 */

import type { Feature, FeatureContext, FeatureManagerInterface } from './types.js';

export class FeatureManager implements FeatureManagerInterface {
  private features: Map<string, Feature>;
  private initialized: Set<string>;
  private initializationOrder: string[];

  constructor() {
    this.features = new Map();
    this.initialized = new Set();
    this.initializationOrder = [];
  }

  /**
   * Register a feature plugin
   * @param feature - Feature to register
   */
  register(feature: Feature): void {
    if (this.features.has(feature.name)) {
      console.warn(`Feature "${feature.name}" is already registered`);
      return;
    }

    this.features.set(feature.name, feature);
  }

  /**
   * Unregister a feature plugin
   * @param name - Feature name
   */
  unregister(name: string): void {
    const feature = this.features.get(name);
    if (!feature) {
      console.warn(`Feature "${name}" is not registered`);
      return;
    }

    // Clean up if initialized
    if (this.initialized.has(name)) {
      void feature.destroy();
      this.initialized.delete(name);
    }

    this.features.delete(name);
  }

  /**
   * Get a registered feature
   * @param name - Feature name
   * @returns Feature or undefined
   */
  get(name: string): Feature | undefined {
    return this.features.get(name);
  }

  /**
   * Check if a feature is registered
   * @param name - Feature name
   * @returns True if registered
   */
  has(name: string): boolean {
    return this.features.has(name);
  }

  /**
   * Get all registered features
   * @returns Map of features
   */
  getAll(): Map<string, Feature> {
    return new Map(this.features);
  }

  /**
   * Initialize all registered features
   * Resolves dependencies and initializes in correct order
   * @param context - Feature context
   */
  async init(context: FeatureContext): Promise<void> {
    // Resolve initialization order based on dependencies
    const order = this.resolveDependencies();
    this.initializationOrder = order;

    // Initialize features in order
    for (const name of order) {
      const feature = this.features.get(name);
      if (!feature) continue;

      try {
        await feature.init(context);
        this.initialized.add(name);
      } catch (error) {
        console.error(`Failed to initialize feature "${name}":`, error);
        throw new Error(`Feature initialization failed: ${name}`);
      }
    }
  }

  /**
   * Destroy all initialized features
   * Destroys in reverse initialization order
   */
  async destroy(): Promise<void> {
    // Destroy in reverse order
    const reverseOrder = [...this.initializationOrder].reverse();

    for (const name of reverseOrder) {
      const feature = this.features.get(name);
      if (!feature || !this.initialized.has(name)) continue;

      try {
        await feature.destroy();
        this.initialized.delete(name);
      } catch (error) {
        console.error(`Failed to destroy feature "${name}":`, error);
      }
    }

    this.initializationOrder = [];
  }

  /**
   * Resolve feature dependencies and return initialization order
   * Uses topological sort to handle dependencies
   * @returns Array of feature names in initialization order
   */
  private resolveDependencies(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (name: string): void => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        throw new Error(`Circular dependency detected: ${name}`);
      }

      visiting.add(name);

      const feature = this.features.get(name);
      if (feature?.dependencies) {
        for (const dep of feature.dependencies) {
          if (!this.features.has(dep)) {
            throw new Error(`Missing dependency: ${dep} (required by ${name})`);
          }
          visit(dep);
        }
      }

      visiting.delete(name);
      visited.add(name);
      order.push(name);
    };

    // Visit all features
    for (const name of this.features.keys()) {
      visit(name);
    }

    return order;
  }

  /**
   * Get initialization status (for debugging)
   */
  getInitializationStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const name of this.features.keys()) {
      status[name] = this.initialized.has(name);
    }
    return status;
  }
}

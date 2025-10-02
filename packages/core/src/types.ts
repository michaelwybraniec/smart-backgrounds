/**
 * Core types for Smart Backgrounds engine
 */

export type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

export interface EventBusInterface {
  on<T = unknown>(event: string, handler: EventHandler<T>): () => void;
  off<T = unknown>(event: string, handler: EventHandler<T>): void;
  emit<T = unknown>(event: string, data?: T): Promise<void>;
  once<T = unknown>(event: string, handler: EventHandler<T>): () => void;
  clear(): void;
}

export interface FeatureConfig {
  enabled?: boolean;
  [key: string]: unknown;
}

export interface SmartBackgroundConfig {
  renderer?: string;
  effect?: unknown;
  features?: Record<string, FeatureConfig>;
  container?: HTMLElement | string;
  [key: string]: unknown;
}

export interface Feature {
  name: string;
  version?: string;
  dependencies?: string[];
  init(context: FeatureContext): void | Promise<void>;
  destroy(): void | Promise<void>;
}

export interface FeatureContext {
  eventBus: EventBusInterface;
  config: FeatureConfig;
  container?: HTMLElement;
}

export interface FeatureManagerInterface {
  register(feature: Feature): void;
  unregister(name: string): void;
  get(name: string): Feature | undefined;
  has(name: string): boolean;
  init(context: FeatureContext): Promise<void>;
  destroy(): Promise<void>;
  getAll(): Map<string, Feature>;
}

export interface SmartBackgroundInterface {
  mount(container: HTMLElement | string): Promise<void>;
  unmount(): Promise<void>;
  update(config: Partial<SmartBackgroundConfig>): Promise<void>;
  getFeature(name: string): Feature | undefined;
  destroy(): Promise<void>;
}

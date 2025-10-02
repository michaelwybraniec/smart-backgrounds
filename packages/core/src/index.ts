/**
 * @smart-backgrounds/core
 * Core engine for smart backgrounds with plugin system and event bus
 */

export { SmartBackground } from './SmartBackground.js';
export { EventBus } from './EventBus.js';
export { FeatureManager } from './FeatureManager.js';

export type {
  SmartBackgroundConfig,
  SmartBackgroundInterface,
  Feature,
  FeatureConfig,
  FeatureContext,
  FeatureManagerInterface,
  EventBusInterface,
  EventHandler,
} from './types.js';

// Smart Features
export * from './features/performance/index.js';

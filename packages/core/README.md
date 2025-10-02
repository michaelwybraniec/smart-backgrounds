# @smart-backgrounds/core

> Core engine for Smart Backgrounds - Plugin system and event-driven architecture

## 🚀 Features

- **SmartBackground** - Main API facade with simple, clean interface
- **FeatureManager** - Plugin system with dependency resolution
- **EventBus** - Event-driven communication between features
- **PerformanceFeature** - FPS monitoring, adaptive quality, GPU detection
- **TypeScript** - Fully typed with strict mode
- **Tree-shakeable** - Only bundle what you use
- **Zero dependencies** - Lightweight and fast

## 📦 Installation

```bash
pnpm add @smart-backgrounds/core
```

## 🎯 Quick Start

```typescript
import { SmartBackground, PerformanceFeature } from '@smart-backgrounds/core';

const bg = new SmartBackground({
  renderer: 'three',
  effect: ParticleSystem,
});

// Register performance feature
const perfFeature = new PerformanceFeature({
  targetFPS: 60,
  adaptiveQuality: true,
  batteryAware: true,
});

bg.getFeatureManager().register(perfFeature);

await bg.mount('#background');
```

## 🏗️ Architecture

### Plugin-Based Design

- Inspired by Three.js and Vue.js plugin systems
- Lazy loading support for optimal bundle size
- Dependency resolution with topological sort
- Circular dependency detection

### Event-Driven Communication

- Loose coupling between features
- Pub/sub pattern via EventBus
- Async event handling support
- Memory-leak prevention with WeakMap

## 📚 API Reference

### SmartBackground

```typescript
const bg = new SmartBackground(config);
await bg.mount(container); // Mount to DOM
await bg.unmount(); // Unmount from DOM
await bg.update(config); // Update configuration
bg.getFeature(name); // Get feature instance
bg.getEventBus(); // Get EventBus instance
bg.isMounted(); // Check mount status
await bg.destroy(); // Cleanup everything
```

### FeatureManager

```typescript
manager.register(feature); // Register a feature plugin
manager.unregister(name); // Unregister a feature
manager.get(name); // Get feature by name
manager.has(name); // Check if registered
await manager.init(context); // Initialize all features
await manager.destroy(); // Destroy all features
```

### EventBus

```typescript
const unsubscribe = bus.on('event', handler); // Subscribe
bus.off('event', handler); // Unsubscribe
await bus.emit('event', data); // Emit event
bus.once('event', handler); // Subscribe once
bus.clear(); // Clear all handlers
```

## 🔌 Creating a Feature Plugin

```typescript
import type { Feature, FeatureContext } from '@smart-backgrounds/core';

export class MyFeature implements Feature {
  name = 'my-feature';
  version = '1.0.0';
  dependencies = ['performance']; // Optional

  async init(context: FeatureContext) {
    // Initialize feature
    context.eventBus.on('some:event', this.handleEvent);
  }

  async destroy() {
    // Cleanup
  }

  private handleEvent = (data: unknown) => {
    // Handle event
  };
}
```

## 📄 License

MIT © Michael Wybraniec

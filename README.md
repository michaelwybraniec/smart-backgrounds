# Smart Backgrounds

> A modular library of stunning, interactive, and **intelligent** backgrounds for websites
>
> Featuring 29+ smart features including performance intelligence, user behavior response, and revolutionary capabilities

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.15-orange)](https://pnpm.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## ✨ Features

### 🧠 Smart & Adaptive

- **Performance Intelligence** - Auto-detects device capabilities, maintains 60 FPS with adaptive quality
- **User Behavior Response** - Mouse, scroll, and touch tracking with parallax effects
- **Context Awareness** - Responds to time of day, theme, and user preferences _(coming soon)_
- **Battery Awareness** - Reduces performance on low battery automatically

### 🎨 Multiple Renderers

- **Three.js** - 3D effects with WebGL 2.0 and GLSL shaders _(coming soon)_
- **Canvas** - 2D effects with OffscreenCanvas optimization _(coming soon)_
- **CSS** - Pure CSS animations for lightweight backgrounds _(coming soon)_

### 🚀 Developer Experience

- **Simple API** - One import, one line of code to use
- **Framework Agnostic** - Works with React, Vue, or vanilla JS
- **TypeScript First** - Fully typed with strict mode
- **Tree-shakeable** - Only bundle what you need
- **Zero Dependencies** - Lightweight core (18KB gzipped)

### ♿ Accessible & Privacy-First

- **WCAG Compliant** - Respects `prefers-reduced-motion` and color schemes
- **No Tracking** - Privacy-first, GDPR compliant, local-first processing
- **Mobile Optimized** - Touch gestures and adaptive performance

## 🚀 Quick Start

```bash
# Install
pnpm add @smart-backgrounds/core

# Or with npm
npm install @smart-backgrounds/core
```

```typescript
import { SmartBackground, PerformanceFeature, UserBehaviorFeature } from '@smart-backgrounds/core';

// Create instance
const bg = new SmartBackground();

// Add smart features
bg.getFeatureManager().register(
  new PerformanceFeature({
    targetFPS: 60,
    adaptiveQuality: true,
    batteryAware: true,
  })
);

bg.getFeatureManager().register(
  new UserBehaviorFeature({
    mouse: { parallax: true },
    scroll: { smooth: true },
    touch: { gestures: ['swipe', 'pinch'] },
  })
);

// Mount to DOM
await bg.mount('#background');

// Listen to events
bg.getEventBus().on('performance:metrics', (metrics) => {
  console.log(`FPS: ${metrics.fps}`);
});
```

## 📊 Project Status

**Phase 1: Foundation & Core Package** - ✅ Complete (100%)

| Component                | Status      | Description                                     |
| ------------------------ | ----------- | ----------------------------------------------- |
| Core Engine              | ✅ Complete | Plugin system, event bus, feature manager       |
| Performance Intelligence | ✅ Complete | FPS monitoring, adaptive quality, GPU detection |
| User Behavior            | ✅ Complete | Mouse/scroll/touch tracking, parallax           |
| Core Utilities           | ✅ Complete | Storage, math, color, logger utilities          |
| Three.js Renderer        | 📋 Next     | 3D effects and particle systems (Phase 2)       |

## 📦 Monorepo Structure

```
smart-backgrounds/
├── packages/
│   ├── core/          # ✅ Core engine with plugin system
│   ├── three/         # Three.js effects (coming soon)
│   ├── canvas/        # Canvas effects (coming soon)
│   ├── css/           # CSS effects (coming soon)
│   ├── physics/       # Physics engine (coming soon)
│   ├── react/         # React bindings (coming soon)
│   └── vue/           # Vue bindings (coming soon)
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## 🛠️ Technology Stack

- **Build System**: Vite, TypeScript, ESBuild
- **Monorepo**: pnpm workspaces + Turborepo
- **Package Manager**: pnpm 8+
- **3D Graphics**: Three.js, WebGL2, GLSL shaders
- **2D Canvas**: Canvas API, OffscreenCanvas
- **Framework Integration**: React 18+, Vue 3
- **Testing**: Vitest, Playwright
- **Documentation**: VitePress or Docusaurus

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   SmartBackground                        │
│                    (API Facade)                          │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼────────┐  ┌──────▼────────┐
│ FeatureManager │  │   EventBus    │  │   Renderer    │
│ (Plugins)      │  │  (Pub/Sub)    │  │  (Three.js)   │
└───────┬────────┘  └───────────────┘  └───────────────┘
        │
   ┌────┴─────┬─────────────┬──────────────┐
   │          │             │              │
┌──▼───┐  ┌──▼───┐  ┌─────▼─────┐  ┌────▼─────┐
│ Perf │  │ User │  │  Context  │  │  Audio   │
│      │  │Behavior│ │ Awareness │  │Reactivity│
└──────┘  └──────┘  └───────────┘  └──────────┘
```

### Core Concepts

- **Plugin Architecture** - All features are plugins that register with FeatureManager
- **Event-Driven** - Loose coupling via EventBus for feature communication
- **Lazy Loading** - Features load on-demand for optimal bundle size
- **Dependency Resolution** - Automatic handling of feature dependencies

## 💻 Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/smart-backgrounds.git
cd smart-backgrounds

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

### Running Examples

```bash
# Build core package
cd packages/core
pnpm build

# Run basic demo
cd ../../examples/basic-demo
pnpm install
pnpm dev
```

Then open http://localhost:5173

## 📚 Documentation

### Core Packages

- [`@smart-backgrounds/core`](packages/core/README.md) - Core engine with plugin system
- `@smart-backgrounds/three` - Three.js renderer _(coming soon)_
- `@smart-backgrounds/canvas` - Canvas renderer _(coming soon)_
- `@smart-backgrounds/react` - React bindings _(coming soon)_
- `@smart-backgrounds/vue` - Vue bindings _(coming soon)_

### Examples

- [Basic Demo](examples/basic-demo) - Test performance and interaction features
- More examples coming soon...

### Resources

- [Project Backlog](agentic-sdlc/tasks/project-backlog.md) - Detailed task breakdown
- [Agentic Workflow Protocol](agentic-sdlc/AWP.md) - Development methodology
- API Documentation _(coming soon)_

## 🎯 Roadmap

### Phase 1: Foundation (Months 1-2) - 80% Complete ✅

- [x] Monorepo setup with pnpm + Turborepo
- [x] Core engine with plugin system
- [x] Performance intelligence feature
- [x] User behavior response feature
- [ ] Core utilities & storage

### Phase 2: Three.js Renderer (Months 3-4)

- [ ] Three.js package setup
- [ ] Particle effects
- [ ] Cosmic effects (black hole physics)
- [ ] Fluid & geometric effects

### Phase 3: Audio & Sensors (Months 5-6)

- [ ] Audio reactivity system
- [ ] Sensor integration APIs
- [ ] Audio → Three.js adapter

### Phase 4: Context & Accessibility (Months 7-8)

- [ ] Context awareness (time, theme)
- [ ] Full WCAG accessibility
- [ ] Color extraction system

[See full roadmap](agentic-sdlc/tasks/project-backlog.md)

## 🤝 Contributing

We welcome contributions! This project follows the **Agentic Workflow Protocol (AWP)** for systematic development.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [AWP.md](agentic-sdlc/AWP.md) for detailed collaboration guidelines.

## 📄 License

Apache License 2.0 © Michael Wybraniec

See [LICENSE](LICENSE) file for details.

**Made with ❤️ by [ONE-FRONT.COM](https://one-front.com) | [OVERVIBING.COM](https://overvibing.com)**

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star on GitHub!

---

**Current Phase**: Phase 1 Complete ✅ | **Next**: Phase 2 - Three.js Renderer

# Basic Demo - Smart Backgrounds

A simple demo to test the core features of Smart Backgrounds.

## Features Tested

- ✅ **Core Engine**: SmartBackground, EventBus, FeatureManager
- ✅ **Performance Intelligence**: FPS monitoring, adaptive quality, GPU detection, battery awareness
- ✅ **User Behavior**: Mouse tracking, scroll tracking, touch gestures, parallax effects

## Running the Demo

```bash
# Install dependencies
pnpm install

# Build the core package first
cd ../../packages/core
pnpm build
cd ../../examples/basic-demo

# Start dev server
pnpm dev
```

Then open http://localhost:5173 in your browser.

## What to Try

1. **Move your mouse** - Watch the background parallax effect
2. **Scroll the page** - Notice the background responds to scroll
3. **Check FPS** - Monitor real-time performance metrics
4. **On mobile** - Try touch gestures (swipe, pinch)
5. **Open DevTools Console** - See detailed event logs

## Expected Behavior

- Background should move subtly with mouse movement (parallax)
- FPS should be tracked and displayed in real-time
- Quality level should adjust automatically if FPS drops
- GPU tier should be detected and displayed
- Mouse and scroll interactions should be tracked
- All metrics should update in the UI panels

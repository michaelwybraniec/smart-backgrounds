/**
 * Basic Demo - Test SmartBackground with Performance and User Behavior features
 */

import {
  SmartBackground,
  PerformanceFeature,
  UserBehaviorFeature,
} from '../../packages/core/dist/index.js';

console.log('🚀 Smart Backgrounds Demo Starting...');

// Create SmartBackground instance
const bg = new SmartBackground({
  container: '#background',
});

// Create and register Performance Feature
const performanceFeature = new PerformanceFeature({
  targetFPS: 60,
  adaptiveQuality: true,
  batteryAware: true,
  pauseOnHidden: true,
  showStats: false, // We'll create our own UI
});

bg.getFeatureManager().register(performanceFeature);

// Create and register User Behavior Feature
const userBehaviorFeature = new UserBehaviorFeature({
  mouse: {
    enabled: true,
    throttle: 16,
    parallax: true,
  },
  scroll: {
    enabled: true,
    throttle: 16,
  },
  touch: {
    enabled: true,
    gestures: ['tap', 'swipe', 'pinch', 'pan'],
  },
});

bg.getFeatureManager().register(userBehaviorFeature);

// Get EventBus for listening to events
const eventBus = bg.getEventBus();

// Mount the background
bg.mount('#background')
  .then(() => {
    console.log('✅ SmartBackground mounted successfully!');
    initializeUI();
  })
  .catch((error) => {
    console.error('❌ Failed to mount SmartBackground:', error);
  });

/**
 * Initialize UI and event listeners
 */
function initializeUI() {
  const bgElement = document.getElementById('background');

  // Performance metrics UI
  eventBus.on('performance:metrics', (metrics) => {
    document.getElementById('fps').textContent = metrics.fps.toFixed(1);
    document.getElementById('avg-fps').textContent = metrics.avgFps.toFixed(1);
  });

  eventBus.on('performance:quality-changed', ({ quality }) => {
    document.getElementById('quality').textContent = quality.toUpperCase();
    console.log('📊 Quality changed:', quality);
  });

  eventBus.on('performance:initialized', ({ gpuCapabilities, batterySupported }) => {
    if (gpuCapabilities) {
      document.getElementById('gpu-tier').textContent =
        `${gpuCapabilities.tier.toUpperCase()} (${gpuCapabilities.renderer})`;
      console.log('🎮 GPU detected:', gpuCapabilities);
    }
    document.getElementById('battery').textContent = batterySupported
      ? 'Monitoring'
      : 'Not supported';
  });

  eventBus.on('performance:battery-low', (status) => {
    document.getElementById('battery').textContent = `Low (${(status.level * 100).toFixed(0)}%)`;
    console.warn('🔋 Low battery detected!');
  });

  // Mouse tracking UI
  const mouseStatus = document.getElementById('mouse-status');
  eventBus.on('interactions:mouse', (position) => {
    mouseStatus.classList.add('active');
    mouseStatus.classList.remove('inactive');

    document.getElementById('mouse-pos').textContent =
      `${position.x.toFixed(0)}, ${position.y.toFixed(0)}`;
    document.getElementById('mouse-velocity').textContent = `${position.speed.toFixed(0)} px/s`;
  });

  // Mouse parallax effect
  eventBus.on('interactions:parallax:mouse', (parallax) => {
    if (bgElement) {
      const scale = 1 + Math.abs(parallax.rotation) * 0.5;
      bgElement.style.transform = `translate(${parallax.x}px, ${parallax.y}px) scale(${scale})`;
    }
  });

  // Scroll tracking UI
  const scrollStatus = document.getElementById('scroll-status');
  eventBus.on('interactions:scroll', (position) => {
    scrollStatus.classList.add('active');
    scrollStatus.classList.remove('inactive');

    document.getElementById('scroll-progress').textContent =
      `${(position.progress * 100).toFixed(1)}%`;
    document.getElementById('scroll-direction').textContent = position.direction.toUpperCase();

    // Reset status after a delay
    setTimeout(() => {
      scrollStatus.classList.remove('active');
      scrollStatus.classList.add('inactive');
    }, 200);
  });

  // Touch gestures
  eventBus.on('interactions:gesture', (gesture) => {
    console.log('👆 Gesture detected:', gesture.type, gesture);
  });

  // Initialize status indicators
  mouseStatus.classList.add('inactive');
  scrollStatus.classList.add('inactive');

  console.log('🎨 UI initialized and listening to events');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  bg.destroy();
  console.log('🧹 SmartBackground cleaned up');
});

// Log feature states
setInterval(() => {
  const perfState = performanceFeature.getState();
  const interactionState = userBehaviorFeature.getState();

  console.log('📊 Current State:', {
    performance: {
      fps: perfState.metrics.fps.toFixed(1),
      quality: perfState.currentQuality,
      paused: perfState.isPaused,
    },
    interactions: {
      mouseActive: interactionState.isMouseActive,
      scrolling: interactionState.isScrolling,
      touching: interactionState.isTouching,
    },
  });
}, 5000); // Log every 5 seconds

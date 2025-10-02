/**
 * Basic Demo - Test SmartBackground with Performance and User Behavior features
 */

import {
  SmartBackground,
  PerformanceFeature,
  UserBehaviorFeature,
  Vector2,
  Color,
  easeInOutQuad,
  easeOutElastic,
  easeOutBounce,
  lerp,
  LocalStorage,
  logger,
} from '../../packages/core/dist/index.js';

// Configure logger
logger.setLevel('debug');
logger.info('🚀 Smart Backgrounds Demo Starting...');
logger.debug('All utilities imported successfully');

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

  logger.info('🎨 UI initialized and listening to events');

  // Initialize utility demos
  initializeUtilityDemos();
}

/**
 * Demonstrate core utilities visually
 */
function initializeUtilityDemos() {
  logger.group('Core Utilities Demo');

  // 1. Vector Math Demo
  const vectorDemo = () => {
    const mousePos = userBehaviorFeature.getMousePosition();
    if (mousePos) {
      const v1 = new Vector2(mousePos.x, mousePos.y);
      const v2 = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
      const distance = v1.distanceTo(v2);
      const angle = Vector2.angle(v1, v2);

      document.getElementById('vector-demo').textContent =
        `Distance: ${distance.toFixed(0)}px, Angle: ${((angle * 180) / Math.PI).toFixed(0)}°`;
    }
  };
  setInterval(vectorDemo, 100);
  logger.debug('Vector demo initialized');

  // 2. Color Utilities Demo - Cycle through colors
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
  let colorIndex = 0;

  const colorDemo = () => {
    const color = Color.fromHex(colors[colorIndex]);
    const hsl = color.toHSL();

    // Animate color change
    const lighter = color.lighten(20);
    document.getElementById('color-demo').style.background =
      `linear-gradient(90deg, ${color.toRgb()}, ${lighter.toRgb()})`;
    document.getElementById('color-text').textContent = `HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;

    colorIndex = (colorIndex + 1) % colors.length;
  };
  colorDemo();
  setInterval(colorDemo, 2000);
  logger.debug('Color demo initialized');

  // 3. Easing Functions Demo - Animated ball
  const easingFunctions = [
    { name: 'easeInOutQuad', fn: easeInOutQuad },
    { name: 'easeOutElastic', fn: easeOutElastic },
    { name: 'easeOutBounce', fn: easeOutBounce },
  ];
  let easingIndex = 0;
  let animationStart = 0;
  const animationDuration = 2000;

  const animateEasing = (timestamp) => {
    if (!animationStart) animationStart = timestamp;
    const elapsed = timestamp - animationStart;
    const progress = Math.min(elapsed / animationDuration, 1);

    const currentEasing = easingFunctions[easingIndex];
    const easedProgress = currentEasing.fn(progress);
    const position = lerp(0, 190, easedProgress); // 190px = 200px container - 10px ball

    document.getElementById('easing-demo').style.left = `${position}px`;

    if (progress < 1) {
      requestAnimationFrame(animateEasing);
    } else {
      // Reset and switch to next easing function
      setTimeout(() => {
        animationStart = 0;
        easingIndex = (easingIndex + 1) % easingFunctions.length;
        logger.debug(`Easing: ${easingFunctions[easingIndex].name}`);
        requestAnimationFrame(animateEasing);
      }, 500);
    }
  };
  requestAnimationFrame(animateEasing);
  logger.debug('Easing demo initialized');

  // 4. LocalStorage Demo
  const storage = new LocalStorage('demo-');
  const storageDemo = () => {
    // Store demo data
    const visitCount = (storage.get('visits') || 0) + 1;
    storage.set('visits', visitCount);
    storage.set('lastVisit', new Date().toISOString());

    const size = storage.getSize();
    document.getElementById('storage-demo').textContent =
      `Visits: ${visitCount}, Size: ${size} bytes`;
  };
  storageDemo();
  setInterval(storageDemo, 5000);
  logger.debug('Storage demo initialized');

  logger.groupEnd();
  logger.info('All utility demos running!');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  bg.destroy();
  console.log('🧹 SmartBackground cleaned up');
});

// Log feature states using logger
setInterval(() => {
  const perfState = performanceFeature.getState();
  const interactionState = userBehaviorFeature.getState();

  logger.debug('📊 Current State:', {
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

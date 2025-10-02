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
 * Demonstrate core utilities with user control
 */
function initializeUtilityDemos() {
  logger.group('Core Utilities Demo');

  // 1. Vector Math Demo - Updates on mouse move (reactive, not chaotic)
  const vectorDemo = () => {
    const mousePos = userBehaviorFeature.getMousePosition();
    if (mousePos) {
      const v1 = new Vector2(mousePos.x, mousePos.y);
      const v2 = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
      const distance = v1.distanceTo(v2);
      const angle = Vector2.angle(v1, v2);

      document.getElementById('vector-demo').textContent =
        `Distance: ${distance.toFixed(0)}px | Angle: ${((angle * 180) / Math.PI).toFixed(0)}°`;
    }
  };
  setInterval(vectorDemo, 100);
  logger.debug('Vector demo initialized');

  // 2. Color Utilities Demo - USER CONTROLLED
  const colors = [
    { hex: '#667eea', name: 'Purple' },
    { hex: '#764ba2', name: 'Violet' },
    { hex: '#f093fb', name: 'Pink' },
    { hex: '#4facfe', name: 'Blue' },
    { hex: '#43e97b', name: 'Green' },
  ];
  let colorIndex = 0;

  window.testColorUtils = () => {
    const colorData = colors[colorIndex];
    const color = Color.fromHex(colorData.hex);
    const hsl = color.toHSL();

    // Show color conversion
    document.getElementById('color-demo').style.background = color.toRgb();
    document.getElementById('color-name').textContent = colorData.hex;
    document.getElementById('color-text').textContent =
      `HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%) | RGB(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;

    logger.info(`Color converted: ${colorData.hex} → ${color.toHslString()}`);
    colorIndex = (colorIndex + 1) % colors.length;
  };
  // Initialize with first color
  window.testColorUtils();
  logger.debug('Color demo initialized (click to test)');

  // 3. Easing Functions Demo - USER CONTROLLED with clear indication
  const easingFunctions = [
    { name: 'easeInOutQuad', fn: easeInOutQuad },
    { name: 'easeOutElastic', fn: easeOutElastic },
    { name: 'easeOutBounce', fn: easeOutBounce },
  ];
  let easingIndex = 0;
  let isAnimating = false;

  window.testEasing = () => {
    if (isAnimating) return; // Prevent overlapping animations

    isAnimating = true;
    const currentEasing = easingFunctions[easingIndex];
    document.getElementById('easing-name').textContent = currentEasing.name;
    logger.info(`Testing easing: ${currentEasing.name}`);

    const duration = 1500;
    const startTime = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = currentEasing.fn(progress);
      const position = lerp(0, 190, easedProgress);

      document.getElementById('easing-demo').style.left = `${position}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - reset to start
        setTimeout(() => {
          document.getElementById('easing-demo').style.left = '0px';
          isAnimating = false;
          easingIndex = (easingIndex + 1) % easingFunctions.length;
        }, 300);
      }
    };
    requestAnimationFrame(animate);
  };
  logger.debug('Easing demo initialized (click to test)');

  // 4. LocalStorage Demo - USER CONTROLLED
  const storage = new LocalStorage('demo-');

  const updateStorageDisplay = () => {
    const visits = storage.get('visits') || 0;
    const lastVisit = storage.get('lastVisit');
    const size = storage.getSize();

    const lastVisitText = lastVisit ? new Date(lastVisit).toLocaleTimeString() : 'Never';

    document.getElementById('storage-demo').textContent =
      `Visits: ${visits} | Last: ${lastVisitText} | Size: ${size}B`;
  };

  window.testStorage = () => {
    const visits = (storage.get('visits') || 0) + 1;
    storage.set('visits', visits);
    storage.set('lastVisit', new Date().toISOString());
    logger.info(`LocalStorage updated: visit #${visits}`);
    updateStorageDisplay();
  };

  // Initial display
  updateStorageDisplay();
  logger.debug('Storage demo initialized (click to test)');

  logger.groupEnd();
  logger.info('✅ All utility demos ready! Click buttons to test.');
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

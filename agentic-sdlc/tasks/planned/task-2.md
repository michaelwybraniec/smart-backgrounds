# Task ID: 2
# Title: Phase 2 - Three.js Package & Effects
# Status: [ ] Pending
# Priority: high
# Owner: 3D Graphics Team
# Estimated Effort: 100h (Months 3-4)

## Description
Create @smart-backgrounds/three package with Three.js-based 3D effects including particles, cosmic phenomena (black holes, galaxies), fluid simulations, and geometric patterns. Implements revolutionary Feature #29: Black Hole/Cosmic Physics.

**Key Deliverables:**
- @smart-backgrounds/three package structure
- ThreeBackground.ts main class + ThreeRenderer adapter
- Particle effects (basic, audio-reactive, evolving)
- Cosmic effects (Galaxy, BlackHole, GravitationalLens, Nebula)
- Fluid & geometric effects
- GLSL shaders (gravity-lens, time-dilation, quantum-noise)
- Adapters connecting core features to Three.js

**Revolutionary Features:**
- Feature #29: Black Hole Physics with gravitational lensing
- Feature #21: Evolving Particles (living patterns)

**Success Criteria:**
- All effects render at 60 FPS (high-quality mode)
- Black hole gravitational lensing shader works
- Audio-reactive particles sync with Feature #7
- Bundle size <40KB gzipped (Three.js excluded)

## Dependencies
- [x] Task ID: 1 (Core package must be complete)
- [x] Task ID: 1.3 (Performance monitoring required)

## Testing Instructions
1. Test all particle effects render correctly
2. Verify black hole gravitational lensing physics
3. Test audio-reactive particles with mock audio data
4. Benchmark FPS for each effect type
5. Test on WebGL 1.0 and WebGL 2.0
6. Verify shaders compile on all browsers
7. Test GPU memory usage (<100MB)
8. Check Three.js integration works

## Security Review
- Validate shader code doesn't execute arbitrary code
- Ensure no WebGL context information leakage
- Check GPU detection doesn't fingerprint users
- Review NASA API integration for rate limiting

## Risk Assessment
**Medium Risk**: Complex 3D graphics can be buggy
- Shader bugs → visual artifacts or crashes
- Three.js breaking changes → maintenance burden
- High GPU usage → battery drain

**Mitigation:**
- Test shaders extensively on different GPUs
- Pin Three.js version initially
- Implement progressive enhancement (fallback to Canvas)

## Strengths
- Three.js is industry standard (proven, stable)
- Black hole physics is unique differentiator
- Particle effects are highly customizable
- Shader-based effects are GPU-accelerated

## Notes
- Three.js adds ~150KB to bundle (user responsibility)
- GLSL shaders must work on GLSL ES 1.0 and 3.0
- NASA APIs provide real astronomy data
- Gravitational lensing uses Einstein equations

## Notes

**📚 Reference:** `../project-backlog.md`
  - Lines 384-424: Three.js package complete structure
  - Lines 213-219: Background Types - Three.js Based
  - Lines 643-683: Usage Example (Hybrid Architecture)
  - Lines 390-410: Effects, Adapters, Shaders structure

## Sub-tasks
- [ ] 2.1: Three.js Package Setup
- [ ] 2.2: Particle Effects (Basic, Audio-Reactive, Evolving)
- [ ] 2.3: Cosmic Effects (#29 Black Hole Physics)
- [ ] 2.4: Fluid & Geometric Effects
- [ ] 2.5: GLSL Shaders
- [ ] 2.6: Three.js Adapters (Audio, Sensor)

## Completed
[ ] Pending

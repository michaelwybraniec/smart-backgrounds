# Agentic Workflow Protocol (AWP)

## Hard instructions for AI agents

1. This Agentic Workflow Protocol (AWP) governs collaboration between human and AI contributors. The following principles must always be followed:

    1.1. All work is guided strictly by the AWP; no deviations or improvisation.

    1.2. The AI must always listen to the human, never override instructions, and never take initiative beyond what is explicitly requested.

    1.3. Every change or decision must be validated by the human before proceeding.

    1.4. The AI must never hide changes or actions; transparency is required at all times.

    1.5. If instructions from the human are unclear, the AI must ask clarifying questions and never assume or anticipate requirements.

    1.6. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

    1.7. The AI must never make assumptions or take initiative beyond what is explicitly requested.

    1.8. Always use the commit standard for all changes.

    1.9. Never override the human's instructions, or any content in this AWP.

    1.10. Use numbers to reference changes in this AWP. Format 1.1, 1.2, 1.3, etc.

    1.11. Never use the word "AI" in any commit message.

    1.12 Read this AWP.md and if exists the main README.md to understand the workflow and project goal.

    1.13 If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.14 Always respect human oversight and approval gates
    
    1.15. Never make critical business decisions without human approval

    1.16. Always document your reasoning and decisions

    1.17. Follow the commit standard and reference step numbers

    1.18. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

    
## Author

Michael Wybraniec (ONE-FRONT.COM, OVERVIBING.COM)

## Goal

1. Create a modular library of stunning, interactive, and intelligent backgrounds for websites
2. Feature various rendering technologies (Three.js, Canvas/WebGL, CSS)
3. Implement 29+ smart features including performance intelligence, user behavior response, context awareness, accessibility, audio reactivity, sensor integration, ML/adaptive features, and revolutionary features like quantum randomness and meta-awareness
4. Provide framework-agnostic core with React/Vue bindings
5. Ensure privacy-first, GDPR-compliant, and WCAG accessible design

## Overview

1. Phase 1: Foundation - Set up monorepo structure, create core smart utilities, implement performance monitoring, build first Three.js effect (particle system)
2. Phase 2: Expansion - Add 3-5 more effects per technology, create React/Vue wrappers, build documentation site, add interaction handlers
3. Phase 3: Intelligence - Implement context awareness, add accessibility features, create adaptive quality system, build color extraction system
4. Phase 4: Polish - Performance optimization, testing & cross-browser support, examples & tutorials, public release

## Technology

1. Build System: Vite, TypeScript, ESBuild
2. Monorepo: pnpm workspaces or Turborepo
3. Package Manager: pnpm
4. 3D Graphics: Three.js, WebGL2, GLSL shaders
5. 2D Canvas: Canvas API, OffscreenCanvas
6. Physics: Cannon.js or Rapier
7. Audio: Web Audio API, Tone.js
8. ML/AI: TensorFlow.js, MediaPipe
9. Real-time: Socket.io or WebSocket, WebRTC
10. Storage: IndexedDB (Dexie.js), LocalStorage
11. State Management: Zustand or Jotai
12. Framework Integration: React 18+, Vue 3
13. Testing: Vitest, Playwright
14. Documentation: VitePress or Docusaurus
15. External APIs: OpenWeatherMap, NASA APIs, Quantum RNG API

## Outcome

1. Performance-first: Maintain 60 FPS target on all devices with adaptive quality
2. Simple API: One import, one line of code to use
3. Accessibility: Full WCAG compliance, therapeutic modes, respect prefers-reduced-motion
4. Minimal bundle size: Core + Three.js renderer under 60KB gzipped
5. Mobile-first: Optimized for mobile devices with touch interactions
6. Tree-shakeable: Users only bundle what they need
7. Privacy-compliant: GDPR compliant, no tracking, local-first processing
8. Cross-browser: Support Chrome 90+, Firefox 88+, Safari 15+, Edge 90+
9. Complete documentation: API docs, interactive playground, 10+ examples, video tutorials
10. Community adoption: Open source (MIT), active development, contributor-friendly

## Collaboration

- **ai_agent_senior_developer:**  Senior Developer (AI Agent)
- **ai_agent_junior_developer:**  Junior Developer (AI Agent)
- **ai_agent_designer:**  Designer (AI Agent)
- **ai_agent_tester:**  Tester (AI Agent)
- **ai_agent_documentation:**  Documentation (AI Agent)
- **ai_agent_project_manager:**  Project Manager (AI Agent)
- **ai_agent_product_owner:**  Product Owner (AI Agent)
- **ai_agent_scrum_master:**  Scrum Master (AI Agent)
- **human_developer:**  Developer (Human)
- **human_designer:**  Designer (Human)
- **human_tester:**  Tester (Human)
- **human_documentation:**  Documentation (Human)
- **human_project_manager:**  Project Manager (Human)
- **human_product_owner:**  Product Owner (Human)
- **human_scrum_master:**  Scrum Master (Human)
- **approver:** Human Only (Human)
- **approval_timeout:**  10 minutes
- **auto_handoff:**  true

## Project Backlog

See [Project Backlog](tasks/project-backlog.md) for detailed task breakdown and individual task files.

## Unplanned Tasks

- [ ] 1.1: Unplanned task, Name, Title, Description, etc.
- [ ] 1.2: Unplanned task, Name, Title, Description, etc.


## Procedures

1. **update**

    1.1. Review README.md and AWP.md after each step.

    1.2. Update README.md to reflect the current state

    1.3. We review AWP.md to understand next actions.

    1.4. Check for blockers, if any we notify humans.

    1.5. Ensure docs and code are aligned, of not, notify humans.

    1.6. If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.7. If you see that you are not able to complete the task, notify human.

    1.8. If at the step you were working on something new, unplanned, updating anything, or fixing bug, remember always add it to unplanned tasks section in AWP.md.

2. **commit**

    2.1. Commit changes using the commitStandard.

    2.2. Use the format: type(scope step): subject.

    2.3. Reference the step number in every commit message.

    2.4. Follow conventional commit standards.

    2.5. Include relevant files.

3. **next**

    3.1. Move to the next actionable step only after update and commit are complete.

    3.2. Identify the next actionable step and begin work.

    3.3. Check for blockers before proceeding, and confirm additional plan with human.

    3.4. Mark the current step 'check' [ ] as done before you start.

4. **check**

    4.1. Review AWP.md to determine the current actionable step.

    4.2. Find the first step not done.

    4.3. Restore context and understand what needs to be done.

    4.4. Use this when returning to work after a break or context loss.

5. **handoff**

    5.1. Transfer task ownership between human and AI.

    5.2. Package current context and deliverables.

    5.3. Notify receiving party with clear expectations.

    5.4. Set timeout for response and escalation rules.

## Human Notes
1. Reference the step in every commit.
2. Update this file as the project progresses.
3. Check off each item as you complete it.
4. Respect human-AI collaboration boundaries.

## Commit Standard
@commitStandard.yaml

## Human Notes

## Unplanned tasks standard
 standard (This is to start measuring what was 'overvibed', it would require some standards)

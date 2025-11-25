<!-- Sync Impact Report
- Version change: [Template] -> 1.0.0
- List of modified principles: Established initial principles based on Nimble strict code review guidelines.
- Added sections: Change Management & Versioning, Development Workflow.
- Templates requiring updates: None (initial setup).
-->

# Nimble Design System Constitution

## Core Principles

### I. Declarative-First Architecture
All component behavior MUST be defined in static, declarative files that TypeScript can analyze at compile time. Runtime code generation (CSS strings, HTML templates, dynamic style composition) is strictly prohibited. Developers must be able to understand component behavior by reading source files without mental execution.

### II. Web Standards & Accessibility Compliance
Components MUST adhere to W3C Web Component specifications (Custom Elements, Shadow DOM) and WHATWG standards. Accessibility is non-negotiable: all components MUST meet WCAG 2.1 Level AA standards, support full keyboard navigation, and utilize correct ARIA roles/attributes. Shadow DOM encapsulation MUST be maintained.

### III. Package Independence & Boundaries
Each workspace package (e.g., `nimble-components`, `angular-workspace`) MUST remain standalone and independent. Cross-package imports from internal directories (e.g., `../other-pkg/src/`) are prohibited. Dependencies MUST be explicit in `package.json`. Build scripts MUST NOT be shared across package boundaries unless via published packages.

### IV. FAST Foundation Alignment
Components MUST leverage the FAST Foundation's declarative template system and reactive state management (observables). Imperative DOM manipulation (e.g., `querySelector`, `innerHTML`, `style.setProperty`) is prohibited where declarative bindings can be used. Lifecycle hooks (`connectedCallback`) MUST be minimal.

### V. Static & Explicit Philosophy
Code MUST prefer static definitions over dynamic generation, explicit logic over clever abstractions, and manual implementation over automatic generation. Code duplication is preferred over complex cross-package dependencies ("Isolated over Shared"). A junior developer should be able to understand the code without tracing complex abstractions.

### VI. Comprehensive Quality Assurance
Changes MUST maintain high test coverage (minimum 90%). Testing MUST include unit tests for public APIs/edge cases, visual regression tests (Chromatic), cross-browser verification (Chrome, Firefox, WebKit), and accessibility testing. Flaky tests MUST be fixed or explicitly skipped with an issue link, never ignored.

## Change Management & Versioning

Every Pull Request impacting a published package MUST include a beachball change file (`npm run change`) describing the impact. Semantic Versioning rules MUST be followed. Breaking changes require migration guides. CI builds and local test scripts (`npm run tdd:watch`) MUST pass before merging.

## Development Workflow

Development MUST follow the established flow:
1.  **Spec**: Interaction (IxD), Visual (ViD), and Technical specs approved before coding.
2.  **Implementation**: Follow `CONTRIBUTING.md` guidelines for the specific package.
3.  **Documentation**: Storybook (`.mdx`) and Matrix stories (`-matrix.stories.ts`) are required for all components.
4.  **Review**: Strict adherence to the "Strict Code Review" guidelines regarding architecture, types, and performance.

## Governance

This Constitution supersedes all other coding practices and guidelines.
Amendments to this document require a Pull Request with explicit justification, version bump, and approval from core maintainers.
All Pull Requests and Code Reviews MUST verify compliance with these principles.
Use `.github/prompts/strict-code-review.prompt.md` for detailed review guidance.

**Version**: 1.0.0 | **Ratified**: 2025-11-25 | **Last Amended**: 2025-11-25

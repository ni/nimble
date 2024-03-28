# ADR: UI Component Contribution Requirements

## Status

<!--
A decision is considered proposed while in PR, and accepted once it is
committed. -->

Accepted.

## Context

<!--
This section describes the forces at play, including technological, political,
social, and project local. These forces are probably in tension, and should be
called out as such. The language in this section is value-neutral. It is simply
describing facts.
-->

The Nimble repo maintains high standards for components. This includes:
- design of API, implementation patterns, readability/maintainability, accessibility, and documentation.
- alignment with existing web patterns through following native HTML component API patterns, understanding consensus and differences amongst other design systems, and being aware of exisiting and new HTML specs with the goal of long-term alignment and adoption.

The process begins with the writing, review, and approval of a spec document. Visual designs and interaction designs must be provided by designers. All vanilla HTML components in `nimble-components` must have corresponding support for Angular and Blazor (in `nimble-angular` and `NimbleBlazor`, respectively). These rigorous standards come with a development cost for both the contributing developers and Nimble code owners.

There have been cases where contributing teams have felt unnecessarily slowed or burdened by the expectations and demands of the Nimble code owners. Furthermore, the burden of reviewing submissions can be significant, and can compete with the Nimble team's own commitments, especially when the contributing teams have deadline pressures. The rigor of the Nimble contribution process can become a disincentive for potential contributors and lead them to instead develop their components outside of Nimble, potentially sacrificing quality and/or reusability for development speed.

Additionally, the Nimble design system is meant for components with "general utility", i.e. components that are the primitive building blocks / [atoms](https://atomicdesign.bradfrost.com/chapter-2/) used to build other components or components one could imagine exisitng in arbitrary other design systems. Generally, components that are product-specific do not belong in Nimble itself. Even though such components may be useful across multiple products and may benefit using the same technologies and infrastructure as Nimble.

While Nimble contributors may opt to create their component as ["incubating"](https://github.com/ni/nimble/blob/a9ba0b6027479fe1cc2267f11957caa329910dfc/packages/nimble-components/CONTRIBUTING.md#marking-a-component-as-incubating), it is expected that an incubating component is on the path to becoming a first-class Nimble component and will eventually meet all the necessary requirements. Though an incubating component can have a lower initial development cost by not having a feature complete implementation, the spec and implementation reviews may still be take considerable time / effort for the developer and the Nimble code owners.

## Decision

- The Nimble repo will begin hosting "Spright" packages that are not part of the Nimble Design System.
    - These packages will parallel their Nimble counterparts: `@ni/spright-components`, `@ni/spright-angular`, and `SprightBlazor`.
    - `spright-components` are characterized as components that are: "[molecules](https://atomicdesign.bradfrost.com/chapter-2/)", product-specific, data-connected, or not "general utility". The primary component implementation should be built on Nimble technologies (FAST, native web components, etc).
    - The framework specific libraries, i.e. `@ni/spright-angular` and `SprightBlazor`, should contain appropriate wrappers / patterns of exposing the `spright-component` implementation in addition to framework-specific concepts used in conjunction with the components, for example Angular Pipes or  Blazor Tag Helpers.
      - Notably, Spright is intended for components leveraging the Nimble technology stack. Spright is *NOT* intended as a place to host arbitrary Angular or Blazor components that are not implemented as web components via FAST.
- The Nimble and Spright packages will be part of the same build, use the same infrastructure, and share the same dependency version management. Spright packages will depend on the Nimble packages.
- Code in Spright packages will be co-owned and reviewed by the Design System team and the contributing team.
  - The goal of spright contributions is to be technically rigorous. To follow modern HTML, CSS, and TypeScript coding styles and follow Nimble's Contributing guidelines, CSS Best Practices, naming conventions, token usage, etc.
  - Nimble developers remain as co-owners to enforce technical quality of implementation. Long-term components live in the Nimble monorepo and have to be patched to follow common patterns, updated with dependencies, supported on test infrastructure, and continually released. This is only mantainable when all code meets the same technical implementation bar.
  - Nimble developers can (and will) give consulting on feature selection (api design for properties / attributes / methods / events, level of accessibility support for aria / keyboard / mouse, interaction design, visual design), while ultimately deferring to the spright contributor for feature selection of what to implement.
- Components that _could/should_ go in Nimble may still opt to go in Spright if the contributing team needs to defer or omit certain work (like creating a full accessibility/interaction plan) to meet a deadline.

The following table compares the requirements for developing a component in different packages: 

|                                  | Approved Spec | Unit Tests | SB* Visual Tests | SB* API Docs | SB* Usage Docs | Approved** VxD | Approved** IxD | Angular/Blazor Support | Proper a11y | Minimal Tech Debt | Mobile Support | 
| -------------------------------- | :-----------: | :--------: | :--------------: | :----------: | :------------: | :------------: | :------------: | :--------------------: | :---------: | :---------------: | :------------: |
| `nimble-components`              | 🟢           | 🟢         | 🟢              | 🟢           | 🟢            | 🟢             | 🟢            | 🟢                     | 🟢         | 🟢                | 🟡
| `nimble-components` (incubating) | 🟢           | 🟢         | 🟢              | 🟢           | 🟡            | 🟡             | 🟢            | 🟡                     | 🟡         | 🟡                | 🟡
| `spright-components`             | 🟢           | 🟢         | 🟢              | 🟢           | 🟡            | 🟡             | 🟡            | 🟡                     | 🟡         | 🟡                | 🟡

🟢 = required\
🟡 = optional\
*SB = Storybook\
**By an interaction and/or visual designer

## Consequences

<!--
This section describes the resulting context, after applying the decision. All
consequences should be listed here, not just the "positive" ones. A particular
decision may have positive, negative, and neutral consequences, but all of them
affect the team and project in the future.
-->
- Developers of components that do not belong in Nimble can still enjoy the benefits of the Nimble tooling, infrastructure, and patterns.
- Design Team's oversight will result in high quality bar and appropriate level of consistency for components not suitable for Nimble.
- Spright's reduced set of requirements provides a team a path to execute a component in a shorter time than in Nimble.
- Components in Spright have more visibility and higher likelihood of reuse (than if developed directly in an app).
- Components in Spright are easier to "graduate" to Nimble due to common dependencies, linting rules, and build configurations. (Though this is only relevant for components that belong in Nimble.)

### High Risk
- Nimble builds will take longer.
- Design System team's bandwidth may still limit the development pace of other teams' components.
    - Other teams should still consult with the Design System team before committing to features dependent on new Nimble/Spright component development.
- There is more ambiguity in Spright around the right balance of reusability vs minimal implementation ([YAGNI](https://martinfowler.com/bliki/Yagni.html)), potentially leading to disagreements in reviews and/or stalled development.

### Low Risk
- More flaky tests (to disable and file bugs for)
- Additional Chromatic snapshots could exhaust our budget.
- Indifferent team could introduce dependencies with security vulnerabilities to a Spright package and leave another team to resolve it.

## Conformance

<!--
This section describes the mechanisms that will be instituted to drive
compliance with the decision. Mechanisms can be automated or manual. Part of the
consideration for conformance should be the need for exceptions, the benefit of
prevention versus detection, and the efficacy of automated versus manual
processes compared to the cost of automation.
-->
- Nimble code owners review any new code or specs in the Nimble repo, so they will ensure components:
    - go where they should (i.e. Nimble vs Spright)
    - meet the requirements for the package they are in

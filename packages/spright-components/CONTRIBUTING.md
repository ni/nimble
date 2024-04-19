# Contributing to Spright Components

This package generally uses the same tooling and policies as Nimble components. See the [`nimble-components` CONTRIBUTING doc](../nimble-components/CONTRIBUTING.md) for an overview. For details on whether a component belongs in Nimble or Spright, refer to the [README](./README.md). This document describes ways in which Spright development differs from Nimble.

The following table compares the requirements for components developed in Spright vs Nimble:

|                      | Approved Spec | Unit Tests | SB\* Visual Tests | SB\* API Docs | SB\* Usage Docs | Approved\*\* VxD | Approved\*\* IxD | Angular/Blazor Support | Proper a11y | Minimal Tech Debt | Mobile Support |
| -------------------- | :-----------: | :--------: | :---------------: | :-----------: | :-------------: | :--------------: | :--------------: | :--------------------: | :---------: | :---------------: | :------------: |
| `nimble-components`  |      🟢       |     🟢     |        🟢         |      🟢       |       🟢        |        🟢        |        🟢        |           🟢           |     🟢      |        🟢         |       🟡       |
| `spright-components` |      🟢       |     🟢     |        🟢         |      🟢       |       🟡        |        🟡        |        🟡        |           🟡           |     🟡      |        🟡         |       🟡       |

🟢 = required\
🟡 = optional\
\*SB = Storybook\
\*\*By an interaction and/or visual designer

## Code ownership

Code in Spright packages will be co-owned and reviewed by the Design System team and the contributing team.

Design System team members remain as co-owners to enforce technical quality of implementation. They can (and will) give consulting on feature selection (API design for properties/attributes/methods/events, level of accessibility support for ARIA/keyboard/mouse, interaction design, visual design), while ultimately deferring to the Spright contributor for what to implement.

Spright component bug fixes and new features should be contributed by the team that needs them. The Design System team will maintain infrastructure like pipelines and dependencies but may request assistance from contributing teams for component-specific issues.

## Code quality

Code should adhere to NI and Nimble standards for quality and test coverage. Spright components may choose to break from Nimble standards on aspects like visual design or API breadth, but should always have a level of quality suitable for use in production applications.

## Documentation

A Spright component's API must be fully documented in Storybook. It is recommended (but not required) that the documentation include a **Usage Guidance** section that explains what the component should and should not be used for. This could include information about feature gaps, guidance about when to use the component rather than a comparable Nimble component, and context about why the component is in Spright rather than Nimble.

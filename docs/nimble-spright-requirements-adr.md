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
The Nimble repo maintains high quality standards for components. This includes quality of API, implementation patterns, readability/maintainability, accessibility, and documentation. The process begins with the writing, review, and approval of a spec document. Visual designs and interaction designs must be provided by designers. All vanilla HTML components in `nimble-components` must have corresponding support for Angular and Blazor (in `nimble-angular` and `NimbleBlazor`, respectively). These rigorous standards come with a development cost for both the contributing developers and Nimble code owners.

There have been cases of tension between the Nimble team and other contributing teams, because the contributing teams have felt unnecessarily slowed or burdened by the expectations and demands of the Nimble code owners. Furthermore, the burden of reviewing submissions can be significant, and can compete with the Nimble team's own commitments, especially when the contributing teams have deadline pressures. The rigor of the Nimble contribution process can become a disincentive for potential contributors and lead them to instead develop their components outside of Nimble, potentially sacrificing quality and/or reusability for development speed.

Additionally, Nimble is only meant for components with general utility. Components that are product-specific for any reason do not belong in Nimble. This, too, can result in components being developed in a specific application, without the benefit of common infrastructure and established patterns, and with limited potential for reuse.

Nimble contributors may opt to create their component as ["incubating"](https://github.com/ni/nimble/blob/a9ba0b6027479fe1cc2267f11957caa329910dfc/packages/nimble-components/CONTRIBUTING.md#marking-a-component-as-incubating), which comes with certain relaxed requirements but, consequently, is not considered ready for general use. It is expected that an incubating component is on the path to becoming a first-class Nimble component and will eventually meet all the necessary requirements. It may be appropriate to treat a component as incubating in cases where an MVP is useful, something temporarily blocks part of the development, or significant tech debt must be deferred to meet a deadline. Though an incubating component can have a lower initial development cost, the spec and implementation reviews may still be take considerable time/effort for the developer and the Nimble code owners.

## Decision

- The Nimble repo will begin hosting "Spright" packages that are not part of the Nimble Design System.
    - These packages will parallel their Nimble counterparts: `@ni/spright-components`, `@ni/spright-angular`, and `SprightBlazor`.
- The Nimble and Spright packages will be part of the same build, use the same infrastructure, and share the same dependency versions.
- Code in Spright packages will be owned and reviewed by contributing teams rather than the Design System team (except for the initial submission establishing the CODEOWNERS). 
- `spright-components` is the place for components that are "molecules", product-specific, data-connected, or otherwise not intended for general use.
- Components that do not have the above characteristics are strongly encouraged to go in the Nimble packages.
    - In some cases (mentioned in the preceeding section), the component may be added as "incubating". It should not be assumed that doing so will significantly shorten development time.
    - Components that _could/should_ go in Nimble may still opt to go in Spright if the contributing team wants to take ownership/responsibility so they can make the tradeoffs necessary to meet a deadline.

The following table compares the requirements for developing a component in different packages: 

|                                  | Approved Spec | Unit Tests | SB* Visual Tests | SB* API Docs | SB* Usage Docs | Approved** VxD | Approved** IxD | Angular/Blazor Support | Proper a11y | Minimal Tech Debt | Mobile Support | 
| -------------------------------- | :-----------: | :--------: | :--------------: | :----------: | :------------: | :------------: | :------------: | :--------------------: | :---------: | :---------------: | :------------: |
| `nimble-components`              | 🟢           | 🟢         | 🟢              | 🟢           | 🟢            | 🟢             | 🟢            | 🟢                     | 🟢         | 🟢                | 🟡
| `nimble-components` (incubating) | 🟢           | 🟢         | 🟢              | 🟢           | 🟡            | 🟡             | 🟢            | 🟡                     | 🟡         | 🟡                | 🟡
| `spright-components`             | 🟡           | 🟢         | 🟢              | 🟢           | 🟡            | 🟡             | 🟡            | 🟡                     | 🟡         | 🟡                | 🟡

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
- Compared to Nimble, Spright provides a team more control over hitting their deadlines by putting them in charge of their reviews.
- Components in Spright have more visibility and higher likelihood of reuse (than if developed directly in an app).
- Components in Spright are easier to "graduate" to Nimble due to common dependencies, linting rules, and build configurations. (Though this is only relevant for components that belong in Nimble.)

### High Risk
- Nimble builds will take longer
- As an alternative to Nimble, Spright (and its delegated oversight) could increase the risk of shipping products with:
    - inconsistent, unapproved visual designs
    - inconsistent, unapproved UX interactions
    - missing or incorrect accessibility support

### Low Risk
- More flaky tests (to disable and file bugs for)
- Additional Chromatic snapshots could exhaust our budget
- Indifferent team could introduce dependencies with security vulnerabilities to a Spright package and leave another team to resolve it. 

## Conformance

<!--
This section describes the mechanisms that will be instituted to drive
compliance with the decision. Mechanisms can be automated or manual. Part of the
consideration for conformance should be the need for exceptions, the benefit of
prevention versus detection, and the efficacy of automated versus manual
processes compared to the cost of automation.
-->
- Nimble code owners review any new code in Nimble and any new directories added in the Spright packages (before new ownership is established), so they will ensure components go where they should.
- It will be up to Spright code owners (i.e. component developers) to enforce component requirements like unit tests, Storybook tests, and Storybook docs.
- It will be up to Spright code owners to enforce conformance to the repo's lint rules (i.e. do not disable or suppress), naming conventions, structure, and other patterns.

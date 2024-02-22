# ADR: UI Component Repos and Requirements

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

- Components with potential for reuse are strongly encouraged to go in Nimble.
    - In some cases (mentioned in the preceeding section), the component may be added as "incubating". It should not be assumed that doing so will significantly shorten development time.
- The [Spright repo](https://github.com/ni/spright) will be an alternative to Nimble. Ownership and review of Spright components falls to the contributing developers. It is up to those owners to define and enforce appropriate standards, but they should conform to a common set of Spright-wide minimum requirements (see table below).
- Product- or service-specific components go in Spright, in a suitably scoped package named like `spright-components-stratus`.
- TODO: When should (strictly Angular) components go in SystemLinkShared?

The following table compares the requirements for developing a component in different libraries: 

|                            | Approved Spec | Unit Tests | SB* Visual Tests | SB* API Docs | SB* Usage Docs | Approved** Visual Design | Approved** UX Design | Angular/Blazor Support | Proper a11y | Minimal Tech Debt | Mobile Support | 
| ---------------------------------- | :-----------: | :--------: | :--------------: | :----------: | :------------: | :----------------------: | :------------------: | :--------------------: | :---------: | :---------------: | :------------: |
| `nimble-components`                | 🟢           | 🟢        | 🟢               | 🟢           | 🟢            | 🟢                       | 🟢                  | 🟢                     | 🟢         | 🟢               | 🟡
| `nimble-components` (incubating)   | 🟢           | 🟢        | 🟢               | 🟢           | 🟡            | 🟡                       | 🟡                  | 🟡                     | 🟡         | 🟡               | 🟡
| `spright-components-<product>`     | 🟡           | 🟢        | 🟢               | 🟢           | 🟡            | 🟡                       | 🟡                  | 🟡                     | 🟡         | 🟡               | 🟡

🟢 = required\
🟡 = optional\
*SB = Storybook\
**By a UX and/or visual designer


## Consequences

<!--
This section describes the resulting context, after applying the decision. All
consequences should be listed here, not just the "positive" ones. A particular
decision may have positive, negative, and neutral consequences, but all of them
affect the team and project in the future.
-->
- Spright's infrastructure increases the ease and consistency of UI component development (compared to creating them in an application).
- Spright gives more visibility to components (than if within an application), increasing likelihood of reuse.
- By using similar infrastructure, utilities, patterns, and rules as Nimble, Spright can make it easier to "graduate" a component to Nimble (than if written within an application).
- Spright may provide a path to shorter development time (compared to Nimble) based on which requirements a team chooses to enforce, and the responsiveness/availability of their reviewers. This can give a team more control over the tradeoffs involved in hitting their deadlines.
- Unless otherwise enforced by individual teams, products may ship with UI components that have:
    - inconsistent, unapproved visual designs
    - inconsistent, unapproved UX interactions
    - missing or incorrect accessibility support


## Conformance

<!--
This section describes the mechanisms that will be instituted to drive
compliance with the decision. Mechanisms can be automated or manual. Part of the
consideration for conformance should be the need for exceptions, the benefit of
prevention versus detection, and the efficacy of automated versus manual
processes compared to the cost of automation.
-->
- It will be up to UI component developers to decide where to put their components. Nimble code owners may redirect developers to Spright if a component does not belong in Nimble. There will be no formal oversight to make sure components that belong in Nimble go there rather than Spright, but guidance may be given informally at Stratus UI Working Group, etc.
- Nimble code owners will (continue to) enforce requirements for all submissions to Nimble.
- It will be up to Spright code owners (i.e. component developers) to enforce baseline component requirements like unit tests, Storybook tests, and Storybook docs.
- It will be up to Spright code owners to conform to the repo's naming conventions, structure, and other patterns.

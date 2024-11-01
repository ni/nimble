# FAST Project Re-alignment HLD

## Problem Statement

Nimble is built on the Microsoft FAST Design System libraries.
A key feature of the libraries was `@microsoft/fast-foundation` which provided a set of custom element base classes to implement common controls (such as buttons, checkboxes, radio buttons, etc).
This was a unique attribute of FAST that enabled Nimble to quickly build a set of common custom elements leveraging the quality of work of Microsoft controls (leveraging modern browser features, focus on accessibility, _fast_ performance).

In April 2022 FAST shared a vision of [The Future of FAST Foundation](https://github.com/microsoft/fast/issues/5901) which presented a future with the potential to improve FAST Foundation integration (template and style extensibility, changes to enable emerging patterns such as Server-Side Rendering, changes to align with scoped custom element registries).
This roadmap caused the (expected to be temporary) uncomfortable situation of the stable releases of FAST to be placed in maintenance mode in an archive branch while the main branch was in beta.

Placing the stable release of FAST in maintenance mode resulted in it being significantly harder to maintain deployed systems (submitting patches to work with new versions of toolchains), slowed uptake of bug fixes, and halted new control development (particularly menu button and date pickers were significant gaps).
Unfortunately the foundation alpha in main never went stable and in May 2024 as part of [FAST Project Re-alignment](https://github.com/microsoft/fast/issues/6955) the foundation library concept and packages were abandoned altogether.

## Status of libraries

### Foundation archive package

- FAST is unwilling to accept future bug fix contributions

### Foundation alpha package

- Has removed several FAST features such as the dependency injection system

### FAST Fluet UI components

- Have inlined the FAST Foundation implementations in a non-reusable way
- Has removed several FAST Foundation features such as the Design Tokens infrastructure
- Has a stable release

### State of Nimble components

- Heavily leverage 

## Links To Relevant Work Items and Reference Material

*Include links to the work items this design addresses.*
*Include links to any other meaningful reference material.*

## Implementation / Design

*Describe the implementation and what systems will be affected. Items to consider include:*
   - *Does the design follow an existing design in this codebase or FAST?*
   - *Does the design align with web standards like web components, ARIA, etc?*
   - *Does the design create new requirements on clients or break any APIs?*
   - *How does the design affect testing, documentation, performance, security, etc?*

*It may be useful to review the sections of the custom component spec template to remind you of other items to consider.*

## Alternative Implementations / Designs

*Describe any design alternatives and discuss why they were rejected.*

## Open Issues

*Describe any open issues with the design that you need feedback on before proceeding.*
*It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source.*

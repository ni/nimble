# FAST Project Re-alignment HLD

## Problem Statement

Nimble is built on the Microsoft FAST Design System libraries.
A key feature of the libraries was `@microsoft/fast-foundation` which provided a set of custom element base classes to implement common controls (such as buttons, checkboxes, radio buttons, etc).
This was a unique attribute of FAST that enabled Nimble to quickly build a set of common custom elements leveraging the quality of work of Microsoft controls (leveraging modern browser features, focus on accessibility, _fast_ performance).

In April 2022 FAST shared a vision of [The Future of FAST Foundation](https://github.com/microsoft/fast/issues/5901) which presented a future with the potential to improve FAST Foundation integration (template and style extensibility, changes to enable emerging patterns such as Server-Side Rendering, changes to align with scoped custom element registries).
This roadmap caused the (expected to be temporary) uncomfortable situation of the stable releases of FAST to be placed in maintenance mode in an archive branch while the main branch was in beta.

Placing the stable release of FAST in maintenance mode resulted in it being significantly harder to maintain deployed systems (submitting patches to work with new versions of toolchains), slowed uptake of bug fixes, and halted new control development (particularly menu button and date pickers were significant gaps).
Unfortunately the FAST Foundation alpha in main never went stable and in May 2024 as part of [FAST Project Re-alignment](https://github.com/microsoft/fast/issues/6955) the Foundation library concept and packages were abandoned altogether.

## Status of libraries

Nimble relies on the following packages:
- `@microsoft/fast-colors` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components) contains v5.3.0, [direct commit for v5.3.1](https://github.com/microsoft/fast/blob/721426cbedafbdfed2b34f9a0e2d902802faa712/packages/utilities/fast-colors/package.json) which is actually used)
- `@microsoft/fast-element` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components))
- `@microsoft/fast-foundation` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components))
- `@microsoft/fast-web-utilities` (we depend on both v5.4.1 transitively from [`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components) and v6 directly from [`archives/fast-foundation-3`](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/utilities/fast-web-utilities))
- `@microsoft/fast-react-wrapper` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components))

### Archive packages

See [archives/fast-element-1](https://github.com/microsoft/fast/tree/archives/fast-element-1) branch.

- FAST has stated that they are [unwilling to accept](https://github.com/microsoft/fast/pull/6960#issuecomment-2344299634) future bug fix contributions in archive branches. Made an [exception for the memory leak bug](https://github.com/microsoft/fast/issues/7022#issuecomment-2344312698).
- Bulk closed [~200 GitHub issues](https://github.com/microsoft/fast/issues?q=is%3Aissue%20label%3Aclosed%3Aobsolete%20closed%3A%3E2024-05-01%20%20) (bugs, new features, etc.) related to archived packages

Users:
- NI Nimble
- [Vonage Vivid 3](https://github.com/Vonage/vivid-3/tree/vivid-v4.10.0)
- [Jupyter UI Toolkit](https://github.com/jupyterlab-contrib/jupyter-ui-toolkit/tree/v0.17.1/packages/components)
- [Microsoft vscode webui toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit/issues/561)
- [GitHub search of fast-foundation users](https://github.com/search?q=fast-foundation+path%3Apackage.json+NOT+is%3Afork&type=code)

### Next Packages

- Has removed several FAST features such as the dependency injection system (i.e. [tagFor](https://github.com/microsoft/fast/pull/6160)).

Users:
- [Adaptive Web Components](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/tree/%40adaptive-web/adaptive-web-components_v0.8.1/packages/adaptive-web-components)

### Stable Packages

Users:
- FluentUI
- Have inlined the FAST Foundation implementations in a non-reusable way
- Has removed several FAST Foundation features such as the Design Tokens infrastructure

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

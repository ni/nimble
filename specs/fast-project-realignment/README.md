# FAST Project Re-alignment HLD

## Problem Statement

Nimble is built on the Microsoft FAST Design System libraries.
A key feature of the libraries was `@microsoft/fast-foundation` which provided a set of custom element base classes to implement common controls (such as buttons, checkboxes, radio buttons, etc).
This was a unique attribute of FAST that:
- enabled Nimble to quickly build a set of common custom elements leveraging the quality of work of Microsoft controls (leveraging modern browser features, focus on accessibility, _fast_ performance).
- gave a shared library from which nimble could adopt new features and contribute fixes (as opposed to forking or writing from scratch).

In April 2022 FAST shared a vision of [The Future of FAST Foundation](https://github.com/microsoft/fast/issues/5901) which had the potential to improve FAST Foundation integration (template and style extensibility, changes to enable emerging patterns such as Server-Side Rendering, changes to align with scoped custom element registries).
This roadmap caused the (expected to be temporary) uncomfortable situation of the stable releases of FAST to be placed in maintenance mode in an archive branch while the main branch was in beta.

Placing the stable release of FAST in maintenance mode resulted in it being significantly harder to maintain deployed systems (submitting patches to work with new versions of toolchains), slowed uptake of bug fixes, and halted new control development (particularly menu button and date / time pickers were significant gaps).
Unfortunately the FAST Foundation alpha in main never went stable and in May 2024 as part of [FAST Project Re-alignment](https://github.com/microsoft/fast/issues/6955) the Foundation library concept and packages were abandoned altogether.

## Status of Packages

Nimble relies on the following packages:
- `@microsoft/fast-colors` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components) contains v5.3.0, [direct commit for v5.3.1](https://github.com/microsoft/fast/blob/721426cbedafbdfed2b34f9a0e2d902802faa712/packages/utilities/fast-colors/package.json) which is actually used)
- `@microsoft/fast-element` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components))
- `@microsoft/fast-foundation` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components))
- `@microsoft/fast-web-utilities` (we depend on both v5.4.1 transitively from [`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components) and v6 directly from [`archives/fast-foundation-3`](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/utilities/fast-web-utilities))
- `@microsoft/fast-react-wrapper` ([`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components))

### Archive packages

See [archives/fast-element-1](https://github.com/microsoft/fast/tree/archives/fast-element-1) branch and relevant packages: [`@microsoft/fast-element`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components/fast-element), [`@microsoft/fast-foundation`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components/fast-foundation), [`@microsoft/fast-web-utilities`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/utilities/fast-web-utilities), [`@microsoft/fast-colors`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/utilities/fast-colors), [`@microsoft/fast-react-wrapper`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/utilities/fast-react-wrapper).

Also see the [fast-components explorer](https://web.archive.org/web/20240126234746/https://explore.fast.design/components) via archive.org.

#### State of archive packages
- FAST has stated that they are [unwilling to accept](https://github.com/microsoft/fast/pull/6960#issuecomment-2344299634) future bug fix contributions in archive branches. Made an [exception for the memory leak bug](https://github.com/microsoft/fast/issues/7022#issuecomment-2344312698).
- Bulk closed [~200 GitHub issues](https://github.com/microsoft/fast/issues?q=is%3Aissue%20label%3Aclosed%3Aobsolete%20closed%3A%3E2024-05-01%20%20) (bugs, new features, etc.) related to archive packages.

#### Users of archive packages
- NI Nimble
- [Vonage Vivid 3](https://github.com/Vonage/vivid-3/tree/vivid-v4.10.0)
- [Jupyter UI Toolkit](https://github.com/jupyterlab-contrib/jupyter-ui-toolkit/tree/v0.17.1/packages/components)
- [Microsoft vscode webui toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit/issues/561) (sunset due to FAST re-alignment)
- [National General](https://components.nationalgeneral.com/ui/?path=/story/components-design-system-provider--branding) (does not appear to be open source)

#### Platform alignment gaps of archive packages

FAST was originally pitched as a tool that would align with modern browser standards however it seems like the release policy of infrequent major releases and pending rewrites to the underlying architecture resulted in stagnation of FAST Foundation component base class development.

Some areas where adoption of baseline features (as of November 2024) may have caused breaking changes but improved alignment with the web platform / common patterns:

- Leveraging the native dialog element in dialogs (for top-layer support of modals).
- Migrating to popover api (for top-layer suport of popovers).
- Native form association and polyfill removal (reduce template complexity by removing proxy targets and fix long-standing polyfill bugs).
- Native element internals aria support (to avoid light dom sprouting of aria attributes).
- Leveraging CSS CustomStateSet (to avoid light dom sprouting of classes).
- Switch to strict typing (avoid typing inconsistencies).
- Fix poor property initialization behavior / default value behavior (avoid inconsistencies with typing and with behavior of native component counterparts).
- Fix poor attribute removal nullability behavior (avoid inconsistencies with typing and with behavior of native component counterparts).
- Implement reusable page-object based testing pattern (currently non-reusable component manipulation for testing).
- Fix poor inter-element communication patterns (currently pollutes public APIs for intercomponent communication).
- Strict content security policy support / removal of adopted stylesheets polyfill (running FAST based components in more CSP contexts).
- Avoiding barrel files (avoid complexities / reliance on tree-shaking for bundle size and potentially improve build times).
- Leveraging modern TypeScript mixin patterns (better typing of mixed in attributes).
- Switch to standard decorators (reduce reliance on legacy runtime logic, not yet in browsers, but [stage 3](https://tc39.es/process-document/)).
    - [TypeScript 5 has support for native decorators](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators).
    - [Angular currently does not plan to support native decorators](https://github.com/angular/angular/issues/48096#issuecomment-1319398602).
    - [Lit supports legacy and native decorators](https://lit.dev/docs/components/decorators/).

Note: Some of the above concerns are addressed in the next packages but that has not been thoroughly evaluated.

### Next packages

See [archives/fast-foundation-3](https://github.com/microsoft/fast/tree/archives/fast-foundation-3) branch and relevant packages: [`@microsoft/fast-element`](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/web-components/fast-element), [`@microsoft/fast-foundation`](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/web-components/fast-foundation), [`@microsoft/fast-web-utilities`](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/utilities/fast-web-utilities)

#### State of next packages
- [Removed FoundationElement and the dependency injection system](https://github.com/microsoft/fast/pull/6160) (i.e. `tagFor`).
- Breaking [public API template changes](https://github.com/microsoft/fast/pull/6286) in FAST Foundation.

#### Users of next packages
- [Adaptive Web Components](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/tree/%40adaptive-web/adaptive-web-components_v0.8.1/packages/adaptive-web-components)

### Stable packages

See [FAST](https://github.com/microsoft/fast) and relevant package: [`@microsoft/fast-element`](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-element)

#### Users of stable packages
- [`@fluentui/web-components`](https://github.com/microsoft/fluentui/tree/master/packages/web-components) v3 (in beta)
    - Have inlined the FAST Foundation [templates/classes](https://github.com/microsoft/fluentui/pull/30090) and [utilities](https://github.com/microsoft/fluentui/pull/31009) in a non-shareable way.
    - [Removed Design Token infrastructure](https://github.com/microsoft/fluentui/pull/30002).

## Links To Relevant Work Items and Reference Material

HLD Work item: [#2207](https://github.com/ni/nimble/issues/2207)

## Implementation / Design

### Priorities

- Unblock Nimble bug fixes and new feature development in the short-term (scope of this HLD).
- Align on a path for long-term maintainability of Nimble (Future work).

### Minimal fork proposal

#### Implementation work

 - Fork the `microsoft/fast` repo to `ni/fast` as a new top-level open source GitHub repository.
    - FAST is licensed similarly to Nimble as MIT. That will be preserved in the fork. License should be [updated](https://softwareengineering.stackexchange.com/a/277699) to reflect NI contributions.
- Make the `archives/fast-element-1` branch the default branch:
    - Keep the name `archives/fast-element-1` on the default branch.
    - Delete branches other than the `archives/*` branches.
- Update the packages to use the `ni` scope:
    - `@microsoft/fast-colors` to `@ni/fast-colors`.
    - `@microsoft/fast-element` to `@ni/fast-element`.
    - `@microsoft/fast-foundation` to `@ni/fast-foundation`.
    - `@microsoft/fast-web-utilities` to `@ni/fast-web-utilities`.
    - `@microsoft/fast-react-wrapper` to `@ni/fast-react-wrapper`.
- Remove unused packages and code (refer to [`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1)):
   
   ```
   /examples
   /packages/tooling
   /packages/utilities/fast-benchmarks
   /packages/utilities/fast-eslint-rules
   /packages/web-components/fast-router
   /sites
   /specs
   ```

- Update npm dependencies to latest.
- Enable renovate updates.
- Add CODEOWNERS configuration (exact owners TBD).
- Update GitHub workflow:
    - Configure beachball to publish on each merge.
    - Make minimal changes (continue to use `yarn`, `lerna`, `chai`, etc).
        - If not a significant effort, switching external facing / globally required tools to align with Nimble would be preferable. In particular switching yarn and lerna to standard npm and npm workspaces would be beneficial for Nimble contributors.

- Update top-level README / CONTRIBUTING to cover intentions of the repo / fork:
    - A set of minimal changes to FAST to continue to adopt bug fixes and potentially minor features only with the goal of alignment / consistency (for example adding start / end slots or label slots consistently).
    - Not a place for significant new features or component development.
    - Treat the `ni/fast` repo similarly to how `microsoft/fast` was treated:
        - Bug fixes or generic changes could be in `fast`.
        - Signficant new feature development may require forking from fast and adopting nimble patterns.
    - External users are welcome to use the NI forks and contribute subject to alignment with the above intentions when documented.

#### Adoption work

- Update Nimble packages to refer to `@ni/fast-*` instead of `@microsoft/fast-*`.
    - Expect the transition to be non-breaking / public APIs of packages to match.
- Update README / CONTRIBUTING documenation to refer to Nimble's FAST Forks where relevant.
- Notify teams directly leveraging `@microsoft/fast-*` to switch to `@ni/fast-*` (See [azdo search for fast](https://dev.azure.com/ni/_search?action=contents&type=code&text=%40microsoft/fast%20%20NOT%20file%3Apackage-lock.json) and [codesearch](https://codesearch.natinst.com/search/text?q=%40microsoft%2Ffast%20-file%3Apackage-lock.json%20-repo%3Agithub-skyline%2Fnimble%2Fmain&fold_case=auto&regex=true&context=true)).
    - The FAST libraries do register a global (`window.FAST`). It is unknown if the Microsoft and NI FAST packages can co-exist in the same app build but I suspect it is likely to cause issues and should be avoided.
    - Some libraries seem to have unnecessary direct dependencies on `@microsoft/fast-` libraries. When possible, unnecessary direct depedencies on anything `fast-` should be avoided and cleaned up.
- Consider repatriating some changes back to FAST where a fork was made for minimal bug fixes (scope not evaluated).

## Alternative Implementations / Designs

### Nimble-owned Archives fork

This proposal would be to fork the FAST packages used by Nimble into the Nimble repository.

Pros:
- Don't need to maintain separate repository infrastructure.
- Monolithic test and build for changes introduced in forked packages.

Cons:
- Would expect packages maintained in Nimble to follow Nimble conventions (linting, test infra, etc). Would either migrate FAST packages to Nimble's lint and test tooling or carve out exceptions and have inconsistency in the repository.
- If following the convention of making minimal changes to the FAST packages then the added build, test, and lint time in CI has minimal benefit.
- Nimble has stricter patterns than FAST (strict typing, patterns around state management, and template design) that would be conflated in the same repository.

### Fork Next

Migrate to the stable FAST element and the archived Foundation next packages.
Similar to Adaptive Web Components (keeping foundation packages separate) or FluentUI (inlining used parts of foundation).

Pros:
- Foundation element maintained upstream.

Cons:
- Likely significant effort to migrate to latest FAST Element and Foundation (scope not evaluated).
- Known breaking changes in FAST Foundation that are ultimately low value if not aligned with an upstream.
- Packages not known to be released in large production scenarios yet (FluentUI usage still in beta).

## Future work

### Priorities

- Closer alignment with native browser features.
- Closer alignment with standard patterns / libraries.
- Minimize risk for future Nimble feature development and maintenance.

### Mid-term goals

The following are suggestions of higher priority mid-term (6-8 month) goals that are proposed to investigate. Listed just for documentation. Approval of the HLD does not commit to / prioritize the mid-term goals.

#### Migrate to the Popover API

Leverage of the Foundation anchored region is one of the largest and most critical polyfills in Nimble powering all popovers (select, combobox, rich text mentions, tooltip). We should align with the native Popover API which provides new capabilities that cannot be given consistently with the anchored region polyfill (the ability to place content in top-layer).

#### Migrate off of Foundation Design Tokens

The FAST Foundation Design Token infrastructure has thus far been fairly complex, a source of performance issues, and is no longer maintained upstream. The FluentUI library has completely removed the Design Token infrastructure.

There are several major ways we leverage FAST Foundation Design Tokens:
- As CSS custom properties coupled to a theme token.
- As non-CSS reflected custom properties for theme and localization tokens.
- As non-CSS reflected custom properties for native attirbutes of lang and dir.

Some research areas (likely more than one needed to fully replace and not comprehensive):
- See how [FluentUI migrated away from Design Tokens](https://github.com/microsoft/fluentui/pull/30002).

    Notes: Having token variable names shared in CSS seems reasonable, but solution lacks programmatic observability and seems to pollute inline styles on body tag / sprouts inline styles on user-owned elements.
- See Lit documentation of [Community Context Protocol](https://lit.dev/docs/data/context/) which cites themes and localization as potential use-cases.

    Notes: Likely a useful part of the solution. Is an open protocol that could potentially be used across frameworks / libraries but would need to validate. FAST had an implementation that added [context protocol support to the Foundation DI system in the Next packages](https://github.com/microsoft/fast/pull/6053).
- See [`StyleObserver`](https://github.com/bramus/style-observer) library which enables programmatically observability of CSS custom property changes.

    Notes: Potentially an interesting way to add observability to CSS custom property changes. Our Design Tokens that need observation are generally not reflected as CSS custom properties today (theme, localization, lang, dir) so we could make them CSS custom properties to leverage the pattern or replace them with an implementation on Community Context Protocol.

#### Leverage heterogeneous base classes

FAST is a relatively small community that no longer has a large shared resource of component development. Web components as a technology do not require us to ship only components built on FAST base classes. We should research utilitization of alternative base classes, such as Lit Element, being shipped with Nimble to give access to a larger community of shared component implementations.

## Open issues

- Should we publicize the fork in the FAST community / discord?

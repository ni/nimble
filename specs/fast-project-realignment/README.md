# FAST Project Re-alignment HLD

## Problem Statement

Nimble is built on the Microsoft FAST Design System libraries.
A key feature of the libraries was `@microsoft/fast-foundation` which provided a set of custom element base classes to implement common controls (such as buttons, checkboxes, radio buttons, etc).
This was a unique attribute of FAST that:
- enabled Nimble to quickly build a set of common custom elements leveraging the quality of work of Microsoft controls (leveraging modern browser features, focus on accessibility, _fast_ performance)
- gave a shared library from which nimble could adopt new features and contribute fixes (as opposed to forking or writing from scratch).

In April 2022 FAST shared a vision of [The Future of FAST Foundation](https://github.com/microsoft/fast/issues/5901) which had the potential to improve FAST Foundation integration (template and style extensibility, changes to enable emerging patterns such as Server-Side Rendering, changes to align with scoped custom element registries).
This roadmap caused the (expected to be temporary) uncomfortable situation of the stable releases of FAST to be placed in maintenance mode in an archive branch while the main branch was in beta.

Placing the stable release of FAST in maintenance mode resulted in it being significantly harder to maintain deployed systems (submitting patches to work with new versions of toolchains), slowed uptake of bug fixes, and halted new control development (particularly menu button and date / time pickers were significant gaps).
Unfortunately the FAST Foundation alpha in main never went stable and in May 2024 as part of [FAST Project Re-alignment](https://github.com/microsoft/fast/issues/6955) the Foundation library concept and packages were abandoned altogether.

## Status of packages

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
- Bulk closed [~200 GitHub issues](https://github.com/microsoft/fast/issues?q=is%3Aissue%20label%3Aclosed%3Aobsolete%20closed%3A%3E2024-05-01%20%20) (bugs, new features, etc.) related to archive packages

#### Users of archive packages
- NI Nimble
- [Vonage Vivid 3](https://github.com/Vonage/vivid-3/tree/vivid-v4.10.0)
- [Jupyter UI Toolkit](https://github.com/jupyterlab-contrib/jupyter-ui-toolkit/tree/v0.17.1/packages/components)
- [Microsoft vscode webui toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit/issues/561) (sunset due to FAST re-alignment)
- [National General](https://components.nationalgeneral.com/ui/?path=/story/components-design-system-provider--branding) (does not appear to be open source)

#### Platform alignment gaps of archive packages

FAST was originally pitched as a tool that would align with modern browser standards however it seems like the release policy of infrequent major releases and pending rewrites to the underlying architecture resulted in stagnation of foundation component base class development.

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
- Breaking [public API template changes](https://github.com/microsoft/fast/pull/6286) in Foundation

#### Users of next packages
- [Adaptive Web Components](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/tree/%40adaptive-web/adaptive-web-components_v0.8.1/packages/adaptive-web-components)

### Stable Packages

See [FAST](https://github.com/microsoft/fast) and relevant package: [`@microsoft/fast-element`](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-element)

#### Users of stable packages
- [`@fluentui/web-components`](https://github.com/microsoft/fluentui/tree/master/packages/web-components) v3 (in beta)
    - Have inlined the FAST Foundation [templates/classes](https://github.com/microsoft/fluentui/pull/30090) and [utilities](https://github.com/microsoft/fluentui/pull/31009) in a non-shareable way
    - [Removed Design Token infrastructure](https://github.com/microsoft/fluentui/pull/30002)

## Links To Relevant Work Items and Reference Material

HLD Work item: [#2207](https://github.com/ni/nimble/issues/2207)

## Implementation / Design

### Priorities

- Unblock Nimble bug fixes and new feature development in the short-term (scope of this HLD)
- Align on a path for long-term maintainability of Nimble (Future work)

### Minimal Fork Proposal

Work that should be done imminently (over the next 1-3 months).

 - Fork the `microsoft/fast` repo to `ni/fast` as a new top-level GitHub repository
- Make the `archives/fast-element-1` branch the default branch
    - Keep the name `archives/fast-element-1` on the default branch
    - Delete other branches
- Update the packages to use the `ni` scope:
    - `@microsoft/fast-colors` to `@ni/fast-colors`
    - `@microsoft/fast-element` to `@ni/fast-element`
    - `@microsoft/fast-foundation` to `@ni/fast-foundation`
    - `@microsoft/fast-web-utilities` to `@ni/fast-web-utilities`
    - `@microsoft/fast-react-wrapper` to `@ni/fast-react-wrapper`
- Remove unused packages and code (refer to [`archives/fast-element-1`](https://github.com/microsoft/fast/tree/archives/fast-element-1))
   
   ```
   /examples
   /packages/tooling
   /packages/utilities/fast-benchmarks
   /packages/utilities/fast-eslint-rules
   /packages/web-components/fast-router
   /sites
   /specs
   ```

- Update npm dependencies to latest
- Update GitHub workflow
    - Configure beachball to publish on each merge
    - Make minimal changes (continue to use `yarn`, `lerna`, `chai`, etc)

- Update top-level README to cover intentions of the repo / fork:
    - A set of minimal changes to fast to continue to adopt bug fixes and potentially minor features only with the goal of alignment / consistency (for example adding start / end slots or label slots consistently)
    - Not a place for significant new features or component development
    - Treat the `ni/fast` repo similarly to how `microsoft/fast` was treated:
        - Bug fixes or generic changes could be in `fast`
        - Signficant new feature development may require forking from fast and adopting nimble patterns
- Notify teams directly leveraging `@microsoft/fast-*` to switch to `@ni/fast-*` (scope not evaluated).
- Consider repatriating some changes back to fast where a fork was made for minimal bug fixes (scope not evaluated)

## Alternative Implementations / Designs

### Fork Archives into Nimble

### Fork Next

### Follow Fluent UI

## Future work

### Priorities

- Closer alignment with native browser features
- Closer alignment with standard patterns / libraries
- Minimize risk for future Nimble feature development and maintenance

### Mid-term goals

Work that should should be done 

### Long-term goals


## Open Issues

None.

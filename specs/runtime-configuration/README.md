# Runtime Configuration

## Problem Statement

Currently Nimble has a couple bits of runtime configuration defined by:
- `theme`
- `direction`

This configuration is communicated to components in Nimble via [FAST Design Tokens](https://www.fast.design/docs/design-systems/design-tokens). Using Design Tokens to express runtime configuration of the Design System has some great characteristics:
- There is a default global configuration that all the components can observe
- Configuration can be overwritten for individual parts of the DOM tree and cascade to the elements below it

This spec covers a refactor / clean-up of how we do runtime configuration to address some specific concerns:

### Reactive Global Configuration

Currently the system is hard coded to provide a `theme` configuration of [`light`](https://github.com/ni/nimble/blob/%40ni/nimble-components_v19.0.0/packages/nimble-components/src/theme-provider/index.ts#L28).

We can instead have the default theme observe the system configured theme preference by default.

### Override Global Configuration

Currently the global default theme cannot be configured in nimble. What this means in practice is that an application must place a `nimble-theme-provider` as high up as possible in the DOM tree in order to override the theme configuration for that part of the tree.

This becomes a pain point for contexts where you might not own the root of the DOM tree let alone the ability to reparent the entire application under a new node. It also feels unnecessary if you really just need to override the default configuration once and not for different parts of the DOM tree.

### Override Local Configuration

You can currently override the local configuration of a branch of the DOM tree by wrapping the content in a `nimble-theme-provider`. This is perfectly reasonable today, but the only concern is that the wrapping element name seems to suggest only `theme` can be configured where additional properties like `direction` are already configured and potentially many more in the future such as [localization strings](https://github.com/ni/nimble/issues/1090#issuecomment-1520566322).

## Links To Relevant Work Items and Reference Material

* Example branch showing [reactive global configuration](https://github.com/ni/nimble/compare/theme-auto-2-revenge-of-theme-auto).

## Implementation / Design

A concept being formalized by this HLD is the idea of `configuration tokens` which are FAST Design Tokens that do not have an associated CSS custom property and are used by elements and the existing `design tokens` to react to changes in configuration (i.e. `theme` or `direction`).

The change has several parts (almost all of which are breaking changes 😅):

### Rename the local configuration element

Rename the `nimble-theme-provider` to `nimble-configuration-provider` to better reflect the responsibility of handling more configuration than just theme in nimble. Otherwise the API itself is unchanged.

Breaking change: Component name change

Alternative:

Keep the name `theme-provider`. It actually seems like a name used in many design systems, i.e. [Material UI](https://mui.com/material-ui/customization/theming/#theme-provider), [Styled Components](https://styled-components.com/docs/advanced), [Vuetify](https://vuetifyjs.com/en/components/theme-providers/), [Amazon Amplify](https://ui.docs.amplify.aws/react/theming/theme-provider) from some quick googling.

I'm actually more convinced now that we shouldn't change it just because the existing terminology ("theme provider") and implementation (a component wrapping a chunk of the tree to override config) seems so common among design systems. I'll let reviewers give feedback.

### Add a global configuration element

Matches the API of the local configuration element but has the behavior of overriding the global default behavior. Can likely [share a base class as done in prototyping](https://github.com/ni/nimble/blob/theme-auto-2-revenge-of-theme-auto/packages/nimble-components/src/theme-base/index.ts#L10).

This makes the global configuration defined by the global configuration element instead of reactive. Reactive global behavior can be restored by clearing the element configuration, for example `el.theme='light';` to override and `el.theme=undefined;` to unset and restore reactive behavior. 

During prototyping in various prime days one thing I tried to address but found challenging was what the behavior should be if multiple global configuration elements were used on a page. I think it's unlikely to be an issue / could be something we try to address if it seems like something multiple clients are accidentally running into. The behavior will be whichever global configuration element most recently updated a configuration token will have set the value. Won't try and track them or guess which should be allowed or blocked, etc.

Proposed name: `nimble-global-configuration-provider` (but should align as the `-global-` version of whatever the decided local configuration name is)

Alternative:
- If multiple global configuration providers are constructed log a warning to the console. This ended up just being annoying during testing where multiple are created and seems doubtful to offer real world value.

### Enable reactive global configuration

Have the `theme` configuration token react to the browser [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).

Have the `direction` configuration token react via MutationObserver to the `<html>` `dir` attribute configuration. See [FAST discussion](https://github.com/microsoft/fast/issues/5547#issuecomment-1027419532) about how the direction token should align with the `dir` attribute. See [W3C dir recommendations](https://www.w3.org/International/questions/qa-html-dir#quickanswer).

Note: This only addresses the top-level `<html dir>` definition and does not try to address the `dir` attribute placement on arbitrary children in the tree. Being responsive to the `<html dir>` seems like a strict improvement on current behavior and more sophisticated behavior can be investigated in the future.

Breaking change: For pages that do not currently have a wrapping theme-provider they will observe that the page now responds to the system theme configuration. The docs say a wrapping theme-provider is required even though it really isn't and is hard coded to the light theme. So technically, for an app that correctly followed the docs, this is not a breaking change.

### Separate design tokens from elements

The proposed element additions make the the placement of the `design-tokens` import undesirable. The current `design-tokens` import also has some unfavorable qualities:

- Because the theme token is currently defined in the theme-provider element, using just `design-tokens` in an application requires by accident (not necessity) the theme-provider registration. With the out-of-the-box reactive global configuration it is possible that applications don't need any theme-provider / nimble element registration at all and just want theme-aware token registration (for example documentation pages)
- The import path looks funny as a child of theme provider

Proposed changes:
- Move the design tokens to `/src/design-tokens/index.ts`
- Move the configuration tokens from being defined as part of an element to a separate `/src/configuration-tokens/index.ts`.

   Similar to element registration, FAST Design Token registration is a side-effect and global, so we may want to prevent over registration. The root `configuration-tokens/index.ts` should only be for the configuration tokens that the design tokens depend on. Component-only tokens should go in separate files.

    For example, if we do have localization configuration tokens which may be fairly large in terms of total string content and bytes on the wire and are only useful for components, we can make those separate narrow focused sets of configuration tokens, i.e.: `/src/configuration-tokens/i18n.ts`. Then users who just want design tokens won't have to pay the cost of the localization tokens only used in components.
- The design tokens perform [root registration](https://www.fast.design/docs/design-systems/design-tokens/#designtoken-root-registration) which is currently accidentally not required as the theme provider is always included when tokens are included resulting in automatic root registration.

Breaking change: Path to design token JS objects change. Should be minimal to no impact on most clients as they should be using the SCSS / CSS custom properties and not direct references to the Design Token JS objects.

## Alternative Implementations / Designs

N/A

## Open Issues

N/A

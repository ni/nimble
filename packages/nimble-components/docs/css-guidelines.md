# CSS Guidelines

## Design Tokens and CSS Custom Properties

Nimble controls have shared style properties such as colors, typography, sizing, and animation properties as defined by the [Nimble Design System](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/). These properties are shared in two different ways: Design Tokens and CSS Custom Properties.

### Design Tokens

Any style property that can be user configurable or is a property used to communicate between components should be defined as a Design Token. To find existing tokens or add new ones see [`design-tokens.ts`](/packages/nimble-components/src/theme-provider/design-tokens.ts).

When a Design Token is defined it will have the following associated with it:
- a SCSS property in the generated `tokens.scss` with the prefix `$ni-nimble-` which is the preferred way for applications to use tokens.
- a SCSS property in the generated `tokens-internal.scss` with the prefix `$ni-nimble-internal-`.
- a CSS Custom Property with the prefix `--ni-nimble-` defined programmatically in the page by the Nimble framework.

For maintainability, the associated CSS Property name should not be hard coded anywhere in nimble-components, ie in components, storybook, tests, etc.

For components, the `css` helper is able to [use design token values in the `css` template string](https://www.fast.design/docs/design-systems/design-tokens#using-design-tokens-in-css) directly.

```js
import {labelFontFamily} from './design-tokens';
const style = css`
    .my-label {
        font-family: ${labelFontFamily};
    }
`;
```

When using the design tokens outside of a component, for example in the `html` helper for a storybook page, the token name can be accessed with [`cssCustomProperty`](https://www.fast.design/docs/api/fast-foundation.cssdesigntoken.csscustomproperty).

```js
import {labelFontFamily} from './design-tokens';
const template = html`
    <style>
        .my-label {
            font-family: var(${labelFontFamily.cssCustomProperty});
        }
    </style>
`;
```

Note: When the token is accessed as a CSS Custom Property it needs to use the `var()` syntax unlike when used in a component with the `css` helper.

### CSS Custom Properties

CSS Custom Properties should generally not be used directly within nimble components. Any CSS Custom Property that a control uses that can be manipulated outside of the control is part of the control's public API and should be defined as a design token.

If a CSS Custom Property is used completely internally to a control, for example it calculates a style inside its shadow root that it uses in multiple places inside its shadow root, then it should not be defined in the design system and should have the `--ni-private-` prefix and include the name of the control to avoid name collisions. For example: `--ni-private-spinner-bits-background-color`.

### Theme-specific styles

Design tokens are theme-aware and should be created for the purpose of creating re-usable design tokens by Nimble Components and by end applications to leverage the Design System.

Design tokens that are not significantly valuable to share externally should not be made just to have theme-aware style behavior. Components can use the [themeBehavior](/packages/nimble-components/src/utilities/style/theme.ts) to create styles that are theme-aware without needing to define a new token.

## Group selectors by target and document order

In a CSS file the rules should be organized by the element they are selecting for. Keeping those selectors grouped together makes it easier to scan a file and see the rules impacting a particular element in one location.

In addition, groups of selectors should be organized in document order, i.e. the order the elements appear when scanning the DOM structure in devtools.

For example for the following runtime DOM:

```html
<my-element>
    #shadow-root (open)
        <div class="start"></div>
        <div class="content">
            ::before
            <slot>
                ↳ text reveal
            </slot>
            ::after
        </div>
        <div class="end"></div>
</my-element>
```

You might organize the styles as follows:
```css
:host {}
:host(:hover) {}
:host([disabled]) {}

.start {}

.content {}
.content::before {}
.content::after {}

slot {}
::slotted {}

.end {}
:host[disabled] .end {}
```

Some takeaways from the example:

- Note that the groups of selectors are organized by target. For example the target of the selector `:host[disabled] .end {}` is `.end` and not `:host` so it is grouped with the other `.end` selectors.

- Note that selectors within groups are organized with the selectors that always apply first. For example the `:host {}` selector always applies, regardless of the state of the element, so it is first in the group. The rest are ordered based on the other recommendations in this document.

- Note that the pseudo-elements are always grouped directly after their target element. For example with the above DOM structure we might expect the `::after` pseudo-element selector to be positioned right before `.end` based on the DOM order.

   Instead psedo-elements are grouped with the target element so `.content::before {}` is immediately followed by `.content::after {}`.


## Prefer cascade for state changes

If you find yourself in complex logic with lots of `:not()` selectors it's possible the code should be reorganized to leverage the CSS cascade for overriding states.

States should flow from plain control -> hover -> focus -> active -> error -> disabled (which overrides all the others).

For example:

```css
:host {}
:host(:hover) {}
:host(${focusVisible}) {} /* focusVisible is specific to FAST */
:host(:active) {}
:host(:invalid) {}
:host(.custom-state) {}
:host([disabled]) {} /* disabled styles override all others in the cascade*/
```

Useful reference: [When do the :hover, :focus, and :active pseudo-classes apply?](https://bitsofco.de/when-do-the-hover-focus-and-active-pseudo-classes-apply/)

## Prefer modern layouts

Prefer flex and grid for layouts. If you find yourself with position absolute / relative and tricky sizing and offsets from top, etc. it might be worth stepping back and seeing if you can take a different approach.

When stepping back try to start at the top-level of the control which is likely in a flex layout and see where parts go. You can also use `display: contents` to make an element ignore its own sizing and propagate a child's sizing up. Useful to potentially avoid deep layers of nested flex layouts.

## Avoid styling functional elements

Some elements are used just for their function such as the `<nimble-theme-provider>` and `<slot>` elements. Those elements should not generally be part of layout and given sizing, etc that is important. Instead they should stay `display: contents` and let their children participate in layout and styling.

## Consider whether text content should be stylable by clients
For controls that display text content, consider whether the client should be allowed to apply custom font properties to that text. For example, a client can set `font-style: italic` on the `nimble-text-field` or `nimble-number-field` to italicize the value. To support this, set the default font properties on the host element, and use `font: inherit` on the element actually displaying the text.

## Comments

To comment on CSS inside the `css` tagged template helper, use template literal strings with an empty string. This helps minified code output.

```ts
const styles = css`
    :host {
        ${
            /*
             * Placing comments in template literals removes them from the compiled code and
             * helps to minify the code output.
             */ ''
        }
        color: gold;
    }
`;
```

## Avoid styling the invalid pseudo-class

When styling the invalid state of a form component, it may seem natural to use `:host(:invalid)` in the CSS selector. `:invalid` applies when the form validation has run (generally happens immediately) and failed on that component. The problem with styling based on this pseudo-class is that it prevents a client from having control over when the invalid styling is displayed. For example, if a required input is initially empty, it is common not to show the error styling until the user has changed the value (and subsequently left it empty).

Instead of styling based on `:invalid`, style the `[error-visible]` attribute. Then the client can create a binding to apply the `invalid` class based on the associated `FormControl`'s status properties, like `invalid`, `dirty`, and `touched`.

## Use FAST's display utility for styling host element

For consistent styling, use FAST's `display` utility when setting a `display` style on the host element.

```ts
import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('flex')}

    :host { /* ... */ }
`;
```

This utility will generate the appropriate display style, as well as a style rule to hide the host element when its `hidden` attribute is set.
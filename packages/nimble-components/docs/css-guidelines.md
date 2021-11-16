# CSS Guidelines

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

## Use design tokens for values that might be configurable

Some attribute values might need to be configurable in context-specific situations like UIs requring different themes, large touch-friendly UIs, or small information-dense UIs.

Examples include colors, typography, sizing, and animation parameters. These attribute values should be specified as shared design tokens rather than literals within an individual component's CSS. This makes it easier to change the values dynamically if required in the future and also improves readability and reduces duplication.

To find existing tokens or add new ones see [`design-tokens.ts`](../src/theme-provider/design-tokens.ts).

## Prefer modern layouts

Prefer flex and grid for layouts. If you find yourself with position absolute / relative and tricky sizing and offsets from top, etc. it might be worth stepping back and seeing if you can take a different approach.

When stepping back try to start at the top-level of the control which is likely in a flex layout and see where parts go. You can also use `display: contents` to make an element ignore its own sizing and propagate a child's sizing up. Useful to potentially avoid deep layers of nested flex layouts.

## Avoid styling functional elements

Some elements are used just for their function such as the `<nimble-theme-provider>` and `<slot>` elements. Those elements should not generally be part of layout and given sizing, etc that is important. Instead they should stay `display: contents` and let their children participate in layout and styling.

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

## Use FAST's `display` utility for styling host element

For consistent styling, use FAST's `display` utility when setting a `display` style on the host element.

```ts
import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('flex')}
    
    :host {}
`;
```

This utility will generate the appropriate display style, as well as a style rule to hide the host element when its `hidden` attribute is set.
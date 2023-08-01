# Nimble Accordion

## Overview

The `nimble-accordion` is a vertical stack of interactive headings. The headings are controls that can be used to reveal or hide content in specific sections. The Nimble accordion is based upon [FAST's accordion component](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components/fast-foundation/src/accordion).

### Background

[Nimble issue #533: nimble-accordion Component](https://github.com/ni/nimble/issues/533)

[Visual Design](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?type=design&node-id=1295-85131&mode=design&t=DxDRlqT7MeCPLOxi-0)

There are several open questions with the current visual design. They're tracked in this GitHub issue [#1399](https://github.com/ni/nimble/issues/1399).

## Design

Accordion group, appearance ghost

```html
<nimble-accordion appearance="ghost">
    <nimble-accordion-item>
        <span slot="heading">Accordion one</span>
        <nimble-checkbox></nimble-checkbox>
        Accordion one content
    </nimble-accordion-item>
    <nimble-accordion-item expanded>
        <span slot="heading">Accordion two</span>
        <nimble-checkbox></nimble-checkbox>
        Accordion two content
    </nimble-accordion-item>
    <nimble-accordion-item>
        <span slot="heading">Accordion three</span>
        <nimble-checkbox></nimble-checkbox>
        Accordion three content
    </nimble-accordion-item>
</nimble-accordion>
```

Accordion group, appearance block with a nested accordion

```html
<nimble-accordion appearance="block">
    <nimble-accordion-item>
        <div slot="heading">Accordion one</div>
        <nimble-checkbox></nimble-checkbox>
        Accordion one content
    </nimble-accordion-item>
    <nimble-accordion-item>
        <div slot="heading">Accordion two</div>
        <nimble-button>Text Button</nimble-button>
        Accordion two content
    </nimble-accordion-item>
    <nimble-accordion-item>
        <div slot="heading">Accordion three</div>
        <nimble-checkbox></nimble-checkbox>
        <nimble-accordion>
            <nimble-accordion-item>
                <div slot="heading">Nested Accordion One</div>
                Nested Accordion One Content
            </nimble-accordion-item>
            <nimble-accordion-item>
                <div slot="heading">Nested Accordion Two</div>
                Nested Accordion Two Content
            </nimble-accordion-item>
        </nimble-accordion>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <div slot="heading">Accordion four</div>
        <nimble-button>Text Button</nimble-button>
        Accordion four content
    </nimble-accordion-item>
</nimble-accordion>
```

### API

#### Nimble Accordion

[FAST accordion API](https://github.com/microsoft/fast/blob/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)

-   _Component Name:_ `nimble-accordion`
-   _Properties/Attributes:_
    -   `appearance` - `block`, `outline`, `ghost`
    -   `expand-mode` - `multi`
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Unchanged
-   _Slots:_ Unchanged

The Figma design includes appearances of the accordion header that reflect those of the `block`, `outline`, and `ghost` appearances used in other components. These designs are similar to those of the nimble-button and its `appearance` types, but the accordion does not use the `.control` css class, it uses `.region` and `.heading`. Because of this, differences in border functionality, and the possibility of excess overridden css classes if patterns are used, shared styles will not be used, and new styles for the accordion and accordion-item will be created. The appearances of `block`, `outline`, and `ghost` will be implemented under the HTML attribute `appearance`, which will use conditional css styles based on `appearance`'s value (ex. `:host([appearance='outline'])` will have styling for the outline button).

Documentation will be added to advise against using multiple Nimble Accordions with different appearances next to each other.

`expand-mode` is a FAST attribute, but is being temporarily modified to have one default value (`multi`) instead of two values (`multi` and `single`). This is because of these issues:

When single expand mode is enabled, the first accordion item is initially open, and can't be closed by clicking on it- it is only closed by clicking a different accordion item. At least one accordion has to be open at all times, which could be confusing to users as the expected functionality would be that all accordion items are initially closed until you open them and can be closed by clicking on that specific accordion item.

This issue will be discussed with UX designers to determine if having this `single` expand mode functionality is necessary.

Additionally, when using nested accordions with the single expand mode, once you open a child accordion, the parent accordion closes- when you open the parent accordion again, the previously selected child accordion is open, but when clicking on it, it doesn't close. Also, when opening the second child accordion, the first child accordion stays open, which goes against the functionality of single expand mode.

This issue with nested accordions will be filed to FAST, and the `expand-mode` attribute will be updated to include the `single` expand mode once FAST resolves this.

#### Nimble Accordion Item

[FAST accordion-item API](https://github.com/microsoft/fast/tree/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion-item)

-   _Component Name:_ `nimble-accordion-item`
-   _Properties/Attributes:_
    -   `error-visible` - boolean
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Unchanged
-   _Slots:_ The `start` and `end` slots will not be used. The `collapsed-icon` and `expanded-icon` slots are set by the nimble-accordion-item in its index.ts, so overriding them will not be supported.

The Figma design also includes an `error` state. This will be controlled with the boolean attribute `error-visible`, which has a default attribute value of "". When needed, "error-visible" would be added to the accordion attributes, changing the color of the accordion item border color to red. This will be implemented in the accordion styling through conditional css styles based on `error-visible`'s value (ex. `:host([error-visible])` will have styling for when `error-visible` is true).

Usage guidance for the `error-visible` state will be created, as its usage may be unclear.

The shoelace design system switched to using `summary` and `details` elements in their accordion styled component, which allowed the [native browser search feature](https://github.com/shoelace-style/shoelace/pull/1470) to search inside of accordions that are closed. FAST does not allow this, so their template for the accordion item will be forked and changed to allow the native browser search feature.

### Angular integration

Angular directives will be created for these components. Neither will have form association, so `ControlValueAccessor`s will not be created.

### Blazor integration

Blazor wrappers will be created for both components.

### Additional requirements

-   _User interaction: Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?_
    -   Nesting Accordions: This is not covered in FAST's examples, but in their [spec](https://github.com/microsoft/fast/blob/archives/fast-element-1/packages/web-components/fast-foundation/src/accordion/accordion.spec.md) they said that "Ideally this behavior will "just work" and no special behaviors will need to be added to enable/support this. The expectation here should be that an accordion takes content and whatever content is inside the accordion panel respects its own interaction model." This functionality was tested within FAST's example by creating a new accordion inside of one of the accordion items, and it functions. The only exception is when expand-mode="single" is used, which is further discussed in the open issues section. Using nested accordions would be preferred, as this allows more to be done with accordions and the ability to include more information without having to make one long accordion.
    -   No Additional Requirements
-   _Styling: Does FAST provide APIs to achieve the styling in the visual design spec?_
    -   No Additional Requirements
-   _Testing: Is FAST's coverage sufficient? Should we write any tests beyond Chromatic visual tests?_
    -   No Additional Requirements
-   _Documentation: Any requirements besides standard Storybook docs and updating the Example Client App demo?_
    -   No Additional Requirements
-   _Tooling: Any new tools, updates to tools, code generation, etc?_
    -   No Additional Requirements
-   _Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc._
    -   These are [aria's guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) for keyboard interactions: enter or space for actions, tab and shift + tab for moving up and down, arrow keys for moving up and down between headers, and home / end (optional) for moving to the first and last accordion header, respectively. I tested all of these in the FAST component explorer, and they're functional. It is expected that these interactions will still be functional when implemented in Nimble.
    -   These are [aria's guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) for WAI-ARIA Roles, States, and Properties. FAST follows the required guidelines including `aria-level`, accordion ids, `aria-expanded`, `aria-controls` `aria-labelledby`, and `aria-hidden`. It does not use `region`, which is an optional panel content role that can be helpful in cases like nested accordions and panels containing heading elements.
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No Additional Requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No Additional Requirements
-   _Security: Any requirements for security?_
    -   No Additional Requirements

---

## Open Issues

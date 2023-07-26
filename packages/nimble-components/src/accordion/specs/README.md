# Nimble Accordion

## Overview

The `nimble-accordion` is a vertical stack of interactive headings. The headings are controls that can be used to reveal or hide content in specific sections. The Nimble accordion is based upon [FAST's accordion component](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/web-components/fast-foundation/src/accordion).

### Background

[Nimble issue #533: nimble-accordion Component](https://github.com/ni/nimble/issues/533)

[Visual Design](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?type=design&node-id=1295-85131&mode=design&t=DxDRlqT7MeCPLOxi-0)

Visual Design Comments:

Brandon's Figma spec has designs for two accordion item heights, 24px and 32px. In previous cases like the nimble button, we've only implemented one height (in that case only the 32px button was implemented). Do we want to continue doing this, and if so, which height should be implemented?

Brandon's Figma spec also only shows designs for one accordion item at a time. How should accordion items in each appearance type be separated from each other (ex. a line between accordion items, transparent space between accordion items, etc.)?

The Figma design does not have a design for the "error" focusVisible state. This might be confusing, as keyboard users who tab to the error accordion will suddenly see the red border and exclamation mark icon disappear in the focusVisible state.

When should each `appearance` type be used? Will there be specific guidance on this, and if so, will it be similar to the guidance for other Nimble components that use the same `appearance` types (ex. the Nimble-Button)?

## Design

Accordion group, appearance ghost with an error-visible accordion item

```
<nimble-accordion appearance="ghost">
    <nimble-accordion-item>
        <span slot="heading">Accordion one</span>
            <div slot="default">
                <nimble-checkbox></nimble-checkbox>
                <span>Accordion one content</span>
            </div>
    </nimble-accordion-item>
    <nimble-accordion-item expanded>
        <span slot="heading">Accordion two</span>
            <div slot="default">
                <nimble-checkbox></nimble-checkbox>
                <span>Accordion two content</span>
            </div>
    </nimble-accordion-item>
    <nimble-accordion-item error-visible>
        <span slot="heading">Accordion three</span>
        <span slot="end"><nimble-icon-exclamation-mark></nimble-icon-exclamation-mark></span>
            <div slot="default">
                <nimble-checkbox></nimble-checkbox>
                <span>Accordion three content</span>
            </div>
    </nimble-accordion-item>
</nimble-accordion>
```

Accordion group, appearance block with a nested accordion

```
<nimble-accordion appearance="block">
    <nimble-accordion-item>
        <div slot="heading">Accordion one</div>
            <div slot="default">
                <nimble-checkbox></nimble-checkbox>
                <span>Accordion one content</span>
            </div>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <div slot="heading">Accordion two</div>
            <div slot="default">
                <nimble-button>Text Button</nimble-button>
                <span>Accordion one content</span>
            </div>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <div slot="heading">Accordion three</div>
            <div slot="default">
                <nimble-checkbox></nimble-checkbox>
                <nimble-accordion>
                    <nimble-accordion-item>
                         <div slot="heading">Nested Accordion One</div>
                            <div slot="default">
                                <span>Nested Accordion One Content</span>
                            </div>
                    <nimble-accordion-item>
                    <nimble-accordion-item>
                         <div slot="heading">Nested Accordion Two</div>
                            <div slot="default">
                                <span>Nested Accordion Two Content</span>
                            </div>
                    <nimble-accordion-item>
                </nimble-accordion>
            </div>
    </nimble-accordion-item>
    <nimble-accordion-item>
        <div slot="heading">Accordion four</div>
            <div slot="default">
                <nimble-button>Text Button</nimble-button>
                <span>Accordion one content</span>
            </div>
    </nimble-accordion-item>
</nimble-accordion>
```

### API

#### Nimble Accordion

[FAST accordion API](https://github.com/microsoft/fast/blob/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)

-   _Component Name:_ `nimble-accordion`
-   _Properties/Attributes:_
    -   `appearance` - `block`, `outline`, `ghost`
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Unchanged
-   _Slots:_ Unchanged

The Figma design includes appearances of the accordion header that reflect those of the `block`, `outline`, and `ghost` appearances used in other components. The appearances of `block`, `outline`, and `ghost` will be implemented under the HTML attribute `appearance`, which will use conditional css styles based on `appearance`'s value (ex. :host([appearance='outline']) will have styling for the outline button).

Based on the Figma design, the styles for the accordion `appearance` types and button-like functionality on click are very similar to those of the nimble-button. The button shared styles can be used in this component, but it's unknown if doing so will require excessive css overrides- if this is the case, creating separate styles would be cleaner. See more about this in the open issues section.

Documentation will be added to advise against using multiple Nimble Accordions with different appearances next to each other.

#### Nimble Accordion Item

[FAST accordion-item API](https://github.com/microsoft/fast/tree/57f3c22c6341d8a21d48b1ffb7fcbfab1ffd02d8/packages/web-components/fast-foundation/src/accordion-item)

-   _Component Name:_ `nimble-accordion-item`
-   _Properties/Attributes:_
    -   `error-visible` - boolean
-   _Methods:_ Unchanged
-   _Events:_ Unchanged
-   _CSS Classes and Custom Properties that affect the component:_ Unchanged
-   _Slots:_ The `start` slot will not be used based on the visual designs, but the `end` slot will be used to display the error icon in the `error-visible` accordion-item state.

The Figma design also includes an `error` state. This will be controlled with the boolean attribute `error-visible`, which has a default attribute value of "". When needed, "error-visible" would be added to the accordion attributes, changing the color of the accordion item border color to red. This will be implemented in the accordion styling through conditional css styles based on `error-visible`'s value (ex. :host([error-visible]) will have styling for when `error-visible` is true).

Usage guidance for the `error-visible` state will be created, as its usage may be unclear.

### Angular integration

An Angular directive will be created for this component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A blazor wrapper will be created for the component.

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
-   _Globalization: special RTL handling, swapping of icons/visuals, localization, etc._
    -   No Additional Requirements
-   _Performance: does the FAST component meet Nimble's performance requirements?_
    -   No Additional Requirements
-   _Security: Any requirements for security?_
    -   No Additional Requirements

---

## Open Issues

Using expand-mode="single" when nesting accordions causes issues- when trying to open nested accordions, the parent accordion closes, which makes sense as the functionality of the attribute is to only allow one accordion open at a time. Unless a reasonable fix can be found, we should advise against using this attribute with nested accordions in the docs.

Regarding the issue of whether or not to use shared styles (in this case using the button shared styles because of the `appearance` similarities), I believe this should be left as an open issue. It's hard to know how the component will react to the button styles until we implement this, so this should be tested and implemented to see if it works before making a decision. If it doesn't work, then shared styles can be removed and completely new styles for the accordion and accordion item can be used.

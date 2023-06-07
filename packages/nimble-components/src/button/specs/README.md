# Nimble-Button New Visual Designs Implementation

## Problem Statement

The Visual Design spec for Nimble buttons now includes primary button states `primary-mono` and `primary` that aren't implemented in the nimble-button component yet.

## Links To Relevant Work Items and Reference Material

[Nimble Issue #663: Adopt nimble-button visual designs for states primary, quiet, and loud](https://github.com/ni/nimble/issues/663)

[Figma Spec](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?type=design&node-id=1295-77205)

## Implementation / Design

[FAST Button API](https://github.com/microsoft/fast/blob/de7f234ef871204fcac2b5df59433d919809341d/packages/web-components/fast-foundation/src/button/README.md)

The appearance of the button will have states `default` (White), `primary-mono` (Black), and `primary` (Green), each with its own color scheme based on the UI theme.
`primary-mono` and `primary` states of buttons are primary buttons, so there should only be one of either in a section.

The `primary-mono` button can be used when there is a conflict with color and its context.
The `primary` button can be used in situations where a button needs to have the most prominent eye-catching approach, or when there is a lack of color.

Ghost buttons will not have `primary-mono` or `primary` states.
Outline and Block buttons in the Color UI will not have a `primary` state, as this has been declared as not recommended for this type of background.

The current appearance-variant attribute will be used to hold these new states, as its previous implementation purpose is no longer used.

-   Does the design follow an existing design in this codebase or FAST?
    -   Yes, this follows exisiting button design- only the button colors are changed.
-   Does the design align with web standards like web components, ARIA, etc?
    -   Yes
-   Does the design create new requirements on clients or break any APIs?
    -   Possible breaking change in styling, as the previous style of the `primary` state used in appearance-variant will be replaced with the new styling
-   How does the design affect testing, documentation, performance, security, etc?
    -   New Chromatic testing for updated styles / states.

## Alternative Implementations / Designs

Can the new button states be placed in the appearance-variant attribute, or should a new attribute be created for this?

## Open Issues

Currently, only the nimble-button and nimble-anchor-button have the appearance-variant attribute. Should the `primary-mono` and `primary` states only be implemented for these buttons, while other buttons such as the nimble-menu-button, nimble-toggle-button, and nimble-card-button (which do not have the appearance-variant attribute) would be left alone?

Molly mentioned that there was a design with a green (Primary) menu button, so should this button type (nimble-menu-button) alone be included and also recieve the appearance-variant attribute?

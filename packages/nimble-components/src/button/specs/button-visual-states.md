# Nimble-Button New Visual Designs Implementation

## Problem Statement

The Visual Design spec for Nimble buttons now includes primary button states `primary` and `primary-accent` that aren't implemented in the nimble-button component yet.

## Links To Relevant Work Items and Reference Material

[Nimble Issue #663: Adopt nimble-button visual designs for states primary, quiet, and loud](https://github.com/ni/nimble/issues/663)

[Figma Spec](https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?type=design&node-id=1295-77205)

## Implementation / Design

There are three possible values for `appearance-variant` on a button: `default`, `primary`, and `primary-accent`, each with its own color scheme based on the UI theme.
`primary` and `primary-accent` states of buttons are primary buttons, which can be used together up to 3 times on a page.

The `primary` button should be the default choice when one button needs to be emphasized.
The `primary-accent` button can be used in situations where a button needs to have the most prominent eye-catching approach, or when there is a lack of color.

Ghost buttons will not have `primary` or `primary-accent` states.
Outline and Block buttons in the Color UI will not have a `primary-accent` state, as this has been declared as not recommended for this type of background.

These limitations will be included in the description of `appearance-variant`, and if their values are selected, the button will change to the `default` value for `appearance-variant`.

The current `appearance-variant` attribute will be used to hold these new states, as its previous implementation purpose is no longer used. Previously existing instances of `primary` buttons using this attribute will automatically use the new `primary` button styling with no modifications required.

Only the `nimble-button` and `nimble-anchor-button` components will have the new visual design states.

-   Does the design follow an existing design in this codebase or FAST?
    -   Yes, this follows exisiting button design- only the button colors are changed.
-   Does the design align with web standards like web components, ARIA, etc?
    -   Yes
-   Does the design create new requirements on clients or break any APIs?
    -   Possible breaking change in styling, as the previous style of the `primary` state used in `appearance-variant` will be replaced with the new styling
-   How does the design affect testing, documentation, performance, security, etc?
    -   New Chromatic testing for updated styles / states.

## Alternative Implementations / Designs

We considered configuring these states via a new attribute but elected to use `appearance-variant` because its previous implementation is no longer used.

We also considered calling the green button (Referencing Light UI) `primary` and the gray button (Referencing Light UI) `primary-accent`, but decided that calling the gray button (Referencing Light UI) `primary` made more sense. This is because it is used more often than `primary-accent`, and should be what the previous `primary` style changes to after the implementation of the new button designs.

## Open Issues

None

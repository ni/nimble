# Add Appearance Attribute to Banner

## Problem Statement

The visual design spec for the Banner component includes an
`outline` appearance that is not yet implemented.

## Links To Relevant Work Items and Reference Material

- [Banner: Add 'outline' appearance mode](https://github.com/ni/nimble/issues/2632)
- [Figma spec](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?m=auto&node-id=8651-46528&t=VZTW2PgF6EW8qbT6-1)

## Implementation / Design

Add an `appearance` attribute with `block` and `outline` values. The property
will be optional and will default to the `block` styles.

### Appearance Attribute

Add `BannerAppearance` to `types.ts`:

```ts
/**
 * Appearances of banners.
 * @public
 */
export const BannerAppearance = {
    block: 'block',
    outline: 'outline'
} as const;

export type BannerAppearance =
    (typeof BannerAppearance)[keyof typeof BannerAppearance];
```

Add the optional property to the `Banner` class:

```ts
@attr
public appearance?: BannerAppearance;
```

Do not initialize the property to `BannerAppearance.block`. The runtime value
will remain `undefined` when the attribute is absent, while the styling
behavior described below maps both `undefined` and `block` to the block
appearance.

### Styling Architecture

Common layout and typography will remain in the existing `styles.ts` file.
Conditional CSS blocks added with `appearanceBehavior` will define the block
and outline treatments. This keeps both appearances explicit and leaves a
clear place to add another appearance, such as `ghost`, later.

Private CSS custom properties will separate theme and severity palette
selection from appearance styling. These properties are implementation details
and will use the `--ni-private-banner-` prefix.

Add the appearance behaviors to the existing stylesheet:

```ts
appearanceBehavior<BannerAppearance | undefined>(
    [undefined, BannerAppearance.block],
    css`
        :host {
            background: var(--ni-private-banner-block-background-color);
        }

        .container {
            background: var(
                --ni-private-banner-block-container-background-color
            );
        }

        slot[name='action']::slotted(nimble-button) {
            ${buttonFillPrimaryColor.cssCustomProperty}: var(
                --ni-private-banner-block-background-color
            );
        }
    `
),
appearanceBehavior(
    BannerAppearance.outline,
    css`
        :host {
            background: var(--ni-private-banner-outline-background-color);
            border: ${borderWidth} solid
                var(--ni-private-banner-outline-border-color);
        }

        .container {
            background: transparent;
            color: var(--ni-private-banner-outline-font-color);
        }
    `
)
```

The action-button token override only affects a slotted `nimble-button` using
`appearance="block"` and `appearance-variant="primary"`, because that is the
button style that consumes `buttonFillPrimaryColor`. It does not recolor
outline or ghost buttons, and it does not affect `nimble-anchor` content.

This results in the following behavior:

| Attribute | Property value | Applied appearance |
| --- | --- | --- |
| Not present | `undefined` | Block |
| `appearance="block"` | `"block"` | Block |
| `appearance="outline"` | `"outline"` | Outline |

### Theme and Severity Colors

The existing block colors will be preserved. Outline backgrounds and known
border colors are listed below.

#### Block Backgrounds

| Theme | Default | Error | Warning | Information | Container overlay |
| --- | --- | --- | --- | --- | --- |
| Light | `Black75` | `Fail100LightUi` | `Warning100LightUi` | `Information100LightUi` | Transparent |
| Dark | `Black75` | `BannerFail100DarkUi` | `Warning100DarkUi` | `Information100DarkUi` | Transparent |
| Color | `applicationBackgroundColor` | Same as default | Same as default | Same as default | `White` at 30% opacity |

#### Outline Backgrounds

| Theme | Background |
| --- | --- |
| Light | `White` / `#FFFFFF` |
| Dark | `Black80` / `#505153` |
| Color | `White` at 7% opacity / `rgba(255, 255, 255, 0.07)` |

#### Outline Borders

| Theme | Default | Error | Warning | Information |
| --- | --- | --- | --- | --- |
| Light | `Black80` / `#505153` | `Fail100LightUi` / `#C4000C` | `WarningTypographyLightUi` / `#D3440D` | `Information100LightUi` / `#804AD9` |
| Dark | `Black50` / `#AEB0B3` | `Fail100DarkUi` / `#FF4663` | `Warning100DarkUi` / `#FF8126` | `Information100DarkUi` / `#A46EFF` |
| Color | `White` at 60% opacity / `rgba(255, 255, 255, 0.60)` | Same as default | Same as default | Same as default |

#### Outline Text and Title

| Theme | Color |
| --- | --- |
| Light | `Black91` / `#161617` |
| Dark | `Black15` / `#F1F1F2` |
| Color | `White` / `#FFFFFF` |

The theme behaviors assign the private palette properties:

```ts
themeBehavior(
    Theme.light,
    css`
        :host {
            --ni-private-banner-block-background-color: ${Black75};
            --ni-private-banner-block-container-background-color: transparent;
            --ni-private-banner-outline-background-color: ${White};
            --ni-private-banner-outline-border-color: ${Black80};
            --ni-private-banner-outline-font-color: ${Black91};
        }

        :host([severity='error']) {
            --ni-private-banner-block-background-color: ${Fail100LightUi};
            --ni-private-banner-outline-border-color: ${Fail100LightUi};
        }

        :host([severity='warning']) {
            --ni-private-banner-block-background-color: ${Warning100LightUi};
            --ni-private-banner-outline-border-color: ${WarningTypographyLightUi};
        }

        :host([severity='information']) {
            --ni-private-banner-block-background-color: ${Information100LightUi};
            --ni-private-banner-outline-border-color: ${Information100LightUi};
        }
    `
),
themeBehavior(
    Theme.dark,
    css`
        :host {
            --ni-private-banner-block-background-color: ${Black75};
            --ni-private-banner-block-container-background-color: transparent;
            --ni-private-banner-outline-background-color: ${Black80};
            --ni-private-banner-outline-border-color: ${Black50};
            --ni-private-banner-outline-font-color: ${Black15};
        }

        :host([severity='error']) {
            --ni-private-banner-block-background-color: ${BannerFail100DarkUi};
            --ni-private-banner-outline-border-color: ${Fail100DarkUi};
        }

        :host([severity='warning']) {
            --ni-private-banner-block-background-color: ${Warning100DarkUi};
            --ni-private-banner-outline-border-color: ${Warning100DarkUi};
        }

        :host([severity='information']) {
            --ni-private-banner-block-background-color: ${Information100DarkUi};
            --ni-private-banner-outline-border-color: ${Information100DarkUi};
        }
    `
),
themeBehavior(
    Theme.color,
    css`
        :host {
            --ni-private-banner-block-background-color: ${applicationBackgroundColor};
            --ni-private-banner-block-container-background-color: ${hexToRgbaCssColor(
                White,
                0.3
            )};
            --ni-private-banner-outline-background-color: ${hexToRgbaCssColor(
                White,
                0.07
            )};
            --ni-private-banner-outline-border-color: ${hexToRgbaCssColor(
                White,
                0.6
            )};
            --ni-private-banner-outline-font-color: ${White};
        }
    `
)
```

Add the appearance and theme behaviors to the existing stylesheet's
`.withBehaviors()` call.

### Test Coverage

Tests will verify that:

- The `appearance` property accepts only values from `BannerAppearance`.
- An absent `appearance` attribute renders the block appearance.
- `appearance="block"` renders identically to the absent attribute state.
- `appearance="outline"` applies the correct background and border for each
  theme and severity combination.
- Changing between `block` and `outline` updates the active styles.
- Existing block rendering remains unchanged.
- A supported block/primary action button receives the banner background
  override.
- Storybook examples exercise each appearance across themes and severities.

## Alternative Implementations / Designs

- **Initialize `appearance` to `BannerAppearance.block`:** This would make the
    property default concrete, but the selected design preserves the distinction
    between an absent attribute and an explicit block appearance.
- **Leave block styling unconditional and only add outline overrides:** This
    would require outline rules to undo block rules. Conditional blocks keep each
    appearance explicit within the same stylesheet and are easier to extend.

## Open Issues

- Confirm the supported or recommended action content for each appearance.
  The proposed token override only mirrors the block background for a
  `nimble-button` configured with block/primary styling.
- Confirm the icon, action, and dismiss-button colors for every appearance,
    theme, and severity combination.

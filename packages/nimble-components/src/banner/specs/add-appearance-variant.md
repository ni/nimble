# Add Appearance Attribute to Banner

## Problem Statement

The visual design spec for the Banner component includes an `outline` appearance that is not yet implemented.

## Links To Relevant Work Items and Reference Material

- [Banner: Add 'outline' appearance mode](https://github.com/ni/nimble/issues/2632)
- [Figma spec](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?m=auto&node-id=8651-46528&t=VZTW2PgF6EW8qbT6-1)

## Implementation / Design

Add an `appearance` attribute with `block` and `outline` values. The property will default to `block`.

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

Add the property to the `Banner` class and initialize it to `block`:

```ts
@attr
public appearance: BannerAppearance = BannerAppearance.block;
```

### Styling Architecture

Common styles will reset appearance-specific backgrounds and box shadows to provide a neutral foundation for the different appearances. The styling architecture is intended to more easily extend to a possible `ghost` appearance type that has been requested.

Conditional CSS blocks added with `appearanceBehavior` will define the block and outline styles.

Private CSS custom properties will separate theme and severity palette selection from appearance styling.

As an example, the light theme will define the new private custom properties as follows. The dark and color themes will assign the same properties using the values listed below.

```ts
:host {
    --ni-private-banner-block-background-color: ${Black75};
    --ni-private-banner-block-container-background-color: transparent;
    --ni-private-banner-outline-background-color: ${White};
    --ni-private-banner-outline-border-color: ${Black80};
    --ni-private-banner-outline-font-color: ${Black91};
    --ni-private-banner-outline-icon-color: ${Black80};
    --ni-private-banner-outline-button-border-color: ${hexToRgbaCssColor(
        Black91,
        0.75
    )};
    --ni-private-banner-outline-action-rgb-partial-color: 255, 255, 255;
    --ni-private-banner-outline-button-font-color: ${Black91};
    --ni-private-banner-outline-button-rgb-partial-color: 22, 22, 23;
}
```

The block behavior will apply the existing background styles. The outline behavior will apply the theme- and severity-specific background, border, text, and icon colors.

The outline will use an inset box shadow rather than a border so that it does not increase the banner's overall dimensions.

A block button with the default appearance variant is recommended for the action slot when the banner uses the outline appearance and this guidance will be documented in storybook.

Because we have used the color theme for the banner for the white rollover and outline button styles, we will need to override those in a light-theme outline banner to use `Black91` at 75% opacity. 


### Theme and Severity Colors

The existing block colors will be preserved. Outline backgrounds and known border colors are listed below.

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

#### Outline Icons

The icon color matches the corresponding outline border color except for the warning severity.

| Theme | Default | Error | Warning | Information |
| --- | --- | --- | --- | --- |
| Light | `Black80` | `Fail100LightUi` | `Warning100LightUi` | `Information100LightUi` |
| Dark | `Black50` | `Fail100DarkUi` | `Warning100DarkUi` | `Information100DarkUi` |
| Color | `White` at 60% opacity | Same as default | Same as default | Same as default |

### Test Coverage

Tests will verify that:

- The `appearance` property accepts only values from `BannerAppearance`.
- An absent `appearance` attribute initializes the property to `block` and renders the block appearance.
- `appearance="block"` renders identically to the absent attribute state.
- `appearance="outline"` applies the correct background and border for each theme and severity combination.
- Changing between `block` and `outline` updates the active styles.
- Existing block rendering remains unchanged.
- Storybook examples exercise each appearance across themes and severities.

### Frameworks
Framework wrappers will be updated to expose the new BannerAppearance attribute.

## Alternative Implementations / Designs

Considered whether it made sense to introduce a common appearance API across components.

## Open Issues

None

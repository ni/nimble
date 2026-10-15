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

Conditional CSS blocks added with `appearanceBehavior` will define the block and outline styles. The appearance changes the banner background and container overlay, text and title color, icon color and border treatment. Layout, spacing, sizing, typography, content, icon selection, and interaction behavior remain the same.

Because the banner uses the color theme to provide the existing white button outline and rollover styles, a light-theme outline banner will override those styles with `Black91` at 75% opacity.

### Theme and Severity Color Strategy

The block appearance background and outline appearance border will use the same color tokens with two exceptions to match the visual design spec:

- Light theme: warning block background and icon use `Warning100LightUi`; outline border will use `WarningTypographyLightUi`.
- Dark theme: error block background uses `BannerFail100DarkUi`; outline border and icon will use `Fail100DarkUi`.

All solid colors required by the design already have named tokens. 

### Test Coverage

The theme matrix story will be updated to include the appearance attribute.

Unit tests will verify that:

- The `appearance` property accepts only values from `BannerAppearance`.
- An absent `appearance` attribute initializes the property to `block`.
- The `appearance` property and attribute reflect one another.

### Frameworks

Framework wrappers will be updated to expose the new BannerAppearance attribute.

### Storybook/Usage Guidelines

Update the Banner storybook to include:
- A block button with the default appearance variant is recommended for the action slot when the banner uses the outline appearance and this guidance will be documented in storybook.
- Specific guidelines from VxD on when to use either appearance. 

## Alternative Implementations / Designs

None

## Open Issues

Identify VxD guidance on when to use each appearance mode and document in storybook.

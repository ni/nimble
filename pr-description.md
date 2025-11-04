## 🤨 Rationale

Adds opt-in multi-color icon support to Nimble. Single-color icons remain unchanged.

## 👩‍💻 Implementation

**Architecture:**
- Multi-color icons extend a `MultiColorIcon` base class (not a mixin) that sets CSS custom properties via `connectedCallback()`
- Separate template (`multiColorTemplate`) for multi-color icons using declarative CSS properties on `:host`
- No runtime type checking or inline style bindings

**Icon Creation:**
- Multi-color icons are manually created in `src/icons-multicolor/` with layer colors specified in constructor
- Metadata in `icon-metadata.ts` marks icons as multi-color (validated at build time)
- Generator skips multi-color icons but exports them from `all-icons.ts`

**Styling:**
- CSS classes `cls-1` through `cls-6` in SVG map to design tokens passed to constructor
- Layer colors set via CSS custom properties (`--ni-nimble-icon-layer-N-color`)
- Multi-color icons don't support `severity` attribute

**Example:** See `nimble-icon-circle-partial-broken` ([Chromatic](https://www.chromatic.com/review?appId=60e89457a987cf003efc0a5b&number=2697))

## 🧪 Testing

- Comprehensive unit tests for multi-color functionality
- Visual regression tests in Storybook/Chromatic
- Build-time validation of layer counts and metadata consistency

## ✅ Checklist

- [x] Documentation updated (CONTRIBUTING.md in both nimble-components and nimble-tokens)

## CSS Shadow Parts

### Exposed Parts

The `nimble-tooltip` exposes a [CSS shadow part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) named `control` for the visual container of the tooltip. This allows consumers to style the tooltip's layout and appearance.

#### Example Usage

```css
nimble-tooltip::part(control) {
    max-width: 300px;
    max-height: 100px;
    overflow: auto;
}
```

This enables you to set any CSS property on the tooltip's visual container.

#### Usage Guidance and Caveats

- The `control` part targets the main visual container of the tooltip. It does not affect the tooltip's positioning or anchoring logic.
- Use the part API for layout and overflow control, not for changing tooltip placement or visibility.
- Some internal styles (such as padding and border) may still apply, so test your overrides to ensure the desired effect.
- The part API is more flexible than custom properties, as it allows targeting any CSS property, not just those exposed as tokens.
- If you need to target other elements inside the tooltip, you may need to request additional parts to be exposed.

---


# Nimble Slider + Nimble Slider-Label

## Overview

The `nimble-slider` component allows the user to move a `thumb` element along a vertical or horizontal axis to select a value. `nimble-slider` is also considered an input field and must work within a `<form>` as other input fields do.

`nimble-slider` will be based on FAST Foundation's `slider`, and will not expose any additional functionailty or changed behavior. See [FAST Foundation slider spec](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/slider/slider.spec.md).

### API

**Unchanged from FAST Foundation slider**

_Component Name_:

-   `nimble-slider`

_Attributes:_

-   `min` - minimum allowed value for the slider
-   `max` - maximum allowed value for the slider
-   `step` - limits the values of the `slider` to increments of the `step` value added to the minimum value of the
    `slider`'s total range. The default value is 1. The minimum and maximum values of a `slider`'s range are always valid results regardless of the `step` prop. The `step` prop is used as the value for incrementing the thumb by pressing the arrow keys.
-   `value` - Allows authors to specify the initial selected range of the `slider`. It defaults to a (step constrained) value at the midpoint on the `slider`'s total range.
-   `orientation` - horizontal or vertical values allowed.
-   `mode` - only supported value is `single-value`. FAST specifies additional modes in its spec, but those modes are not yet implemented.

_Events_

-   `change` - raise the change event for external parties to be informed of the `slider`'s value change.

_Slots_

-   `track` - the `horizontal` or `vertical` track along which the thumb slides
-   `thumb` - the control the user drags along the track to change the value of the slider
-   `default` slot - Providing child elements to the `nimble-slider` will be hosted in the default slot and presented as track labels. See `nimble-slider-label` below.

### Angular Integration

The slider will have an Angular directive in the `nimble-angular` package which allows binding to the attributes listed above. The slider will also have a `ControlValueAccessor` for use in Angular forms.

### Color customization

Consumers of the slider may want to customize the fill color of the slider track. We should make sure to support this by letting users override a CSS variable in the slider's styles. We should also document the variable name to override, as well as possibly provide suggestions for theme-aware variables to use as alternate colors.

# Slider Label

## Overview

The `nimble-slider-label` component provides a default styled label to be placed inside a `nimble-slider` component. Users can choose to hide the mark as well as provide custom label content. Users can include multiple `nimble-slider-label` components in a `nimble-slider` to annotate multiple values along the slider track.

### API

**Unchanged from FAST Foundation slider label**

_Component Name_

-   `nimble-slider-label`

_Attributes_

-   `hide-mark` - boolean to show/hide the mark. Default is false.
-   `position` - used to position the label at the corresponding value on the track

_Slots_

-   `label` - replace the label with your dom

_Parts_

-   `label` - style the label shown under the mark

### Angular Integration

The slider label will have an Angular directive in the `nimble-angular` package which allows binding to the attributes listed above.

## Example usage

```html
<nimble-slider max="100" min="0" orientation="horizontal" step="1">
    <nimble-slider-label position="25">25</nimble-slider-label>
    <nimble-slider-label position="50">50</nimble-slider-label>
    <nimble-slider-label position="75">75</nimble-slider-label>
</nimble-slider>
```

## FAST issues

A few issues with the FAST slider implementation may affect our usage.

1. The slider positions the thumb visual [using a percent offset rounded to a whole number](https://github.com/microsoft/fast/blob/eeb625e346a54da4c1f338eb90341a6e2d9ddb83/packages/web-components/fast-foundation/src/slider/slider.ts#L307). This means that there are only 101 possible visual positions for the thumb on the slider, even if the number of possible values is greater.
    - To see this issue in action, try setting the range on a [Fast slider](https://explore.fast.design/components/fast-slider) to 0-1000, with an increment of 1. If you try to move the slider thumb pixel-by-pixel by dragging, or use directional keys to change the value, you will see that the thumb only moves after changing the value significantly.
    - I'm not sure if this issue is a showstopper or not. It is kind of annoying to not have visual feedback while trying to precisely adjust a slider. But it might not be very common for a client to want a high-resolution slider (sliders seem kind of low-res by design, as opposed to number fields). Also, this problem only really affects larger sliders.
    - [Filed an issue to FAST](https://github.com/microsoft/fast/issues/5507)
2. The slider does not have an `input` event, and fires a `change` event on every drag move.
    - This behavior does not match the native `<input type="range">` element
    - [Filed an issue to FAST](https://github.com/microsoft/fast/issues/5508)
3. The slider's `value` property is a string, and does not have a convenience number-typed property like native inputs do.
    - [Filed an issue to FAST](https://github.com/microsoft/fast/issues/5506)

## Open issues

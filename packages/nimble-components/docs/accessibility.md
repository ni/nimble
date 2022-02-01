# General accessibility

## ARIA attributes
When setting [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) on nimble components, avoid using id-based attributes, such as `aria-labelledby`. The id-based attributes may not behave as expected when used with Shadow DOM components, such as `nimble`.

# Component-specific accessiblity notes

## nimble-button
When using the `nimble-button` with only an icon, `contentHidden` should be set to `true` and text content should be provided within the button even though it will not be visible on the screen. The button will use the text content to configure the appropriate ARIA attributes internally to ensure the button is adequately accessible with a screen reader.
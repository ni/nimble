# General accessibility

## Creating templates with ARIA attributes
When creating a new component whose template is defined within nimble and whose entry in the browser's accessibility tree is coming from within the shadow root, the ARIA attributes set on the component need to be reflected onto the element within the template that is in the accessibility tree.

For example:
```js
class CoolNewButton extends FoundationElement { }
```

```html
export const template = html<CoolNewButton>`
    <template>
        <!-- The button, rather than the template, creates an entry in the accessibility tree. Reflect ARIA attributes onto it. -->
        <button
            aria-atomic="${x => x.ariaAtomic}"
            aria-busy="${x => x.ariaBusy}"
            ...
        >
        </button>
    </template>
```

## Setting ARIA attributes
When setting [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) on nimble components, avoid using id-based attributes, such as `aria-labelledby`. The id-based attributes may not behave as expected when used with Shadow DOM components, such as `nimble`.

# Component-specific accessiblity notes

## nimble-button
When using the `nimble-button` with only an icon, `contentHidden` should be set to `true` and text content should be provided within the button even though it will not be visible on the screen. The button will use the text content to configure the appropriate ARIA attributes internally to ensure the button is adequately accessible with a screen reader.
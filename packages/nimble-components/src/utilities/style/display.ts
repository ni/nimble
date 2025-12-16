import {
    type CSSDisplayPropertyValue,
    // eslint-disable-next-line no-restricted-imports
    display as foundationDisplay
} from '@ni/fast-foundation';

/**
 * Each element should use the display utility which will create styles to:
 * - Set the `:host` display property
 * - Respond to the `hidden` attribute set on `:host`
 * - Configure `box-sizing` for `:host`, all elements in shadow root, and `::before` / `::after` pseudoelements
 */
export const display: typeof foundationDisplay = (
    displayValue: CSSDisplayPropertyValue
) => `${foundationDisplay(displayValue)}:host{box-sizing:border-box;touch-action:manipulation;}*{box-sizing:border-box;touch-action:manipulation;}:host::before,:host::after,::before,::after{box-sizing:border-box;}`;

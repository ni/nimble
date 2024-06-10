import {
    type CSSDisplayPropertyValue,
    // eslint-disable-next-line no-restricted-imports
    display as foundationDisplay
} from '@microsoft/fast-foundation';

/**
 * This utility will generate the appropriate display style, as well as a style rule
 * to hide the host element when its `hidden` attribute is set.
 */
export const display: typeof foundationDisplay = (
    displayValue: CSSDisplayPropertyValue
) => `${foundationDisplay(displayValue)}:host{box-sizing:border-box;}*{box-sizing:border-box;}:host::before,:host::after,::before,::after{box-sizing:border-box;}`;

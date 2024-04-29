import {
    type CSSDisplayPropertyValue,
    // eslint-disable-next-line no-restricted-imports
    display as foundationDisplay
} from '@microsoft/fast-foundation';

export const display: typeof foundationDisplay = (
    displayValue: CSSDisplayPropertyValue
) => `${foundationDisplay(displayValue)}:host,*,*::before,*::after{box-sizing:border-box}`;

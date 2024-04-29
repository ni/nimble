// eslint-disable-next-line no-restricted-imports
import { type CSSDisplayPropertyValue, display as foundationDisplay } from '@microsoft/fast-foundation';

export const display: typeof foundationDisplay = (displayValue: CSSDisplayPropertyValue) => `${foundationDisplay(displayValue)}:host,*,*::before,*::after{box-sizing:border-box}`;

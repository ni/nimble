import { cssPartial } from '@microsoft/fast-element';

/**
 * Set user-select: none in a way that works across all supported browsers.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/user-select#browser_compatibility
 */
export const userSelectNone = cssPartial`
    user-select: none;
    -webkit-user-select: none;
`;

/**
 * This file is a workaround for: https://github.com/prettier/prettier/issues/11400
 */

// eslint-disable-next-line no-restricted-imports
import { focusVisible as focusVisibleOriginal } from '@microsoft/fast-foundation';

/**
 * The string representing the focus selector to be used. Value
 * will be ":focus-visible" when https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
 * is supported and ":focus" when it is not.
 *
 * @public
 */
export const focusVisible = `:${focusVisibleOriginal}`;

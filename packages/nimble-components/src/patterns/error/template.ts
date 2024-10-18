import { html } from '@microsoft/fast-element';
import type { ErrorPattern } from './types';
import { overflow } from '../../utilities/directive/overflow';

export const errorTextTemplate = html<ErrorPattern>`
    <div
        class="error-text"
        ${overflow('errorHasOverflow')}
        title="${x => (x.errorHasOverflow && x.errorText ? x.errorText : null)}"
        aria-live="polite"
    >
        ${x => x.errorText}
    </div>
`;

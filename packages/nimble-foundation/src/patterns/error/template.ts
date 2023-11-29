import { html } from '@microsoft/fast-element';
import type { ErrorPattern } from './types';

export const errorTextTemplate = html<ErrorPattern>`
    <div class="error-text" title="${x => x.errorText}" aria-live="polite">
        ${x => x.errorText}
    </div>
`;

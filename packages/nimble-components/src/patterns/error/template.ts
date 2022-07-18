import { html } from '@microsoft/fast-element';
import type { IHasErrorText } from './types';

export const errorTextTemplate = html<IHasErrorText>`
    <div class="error-text" title="${x => x.errorText}" aria-live="polite">
        ${x => x.errorText}
    </div>
`;

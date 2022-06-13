import { html } from '@microsoft/fast-element';
import type { InternalErrorText } from '.';

export const template = html<InternalErrorText>`
    <template title="${x => x.errorText}" aria-live="polite">
        ${x => x.errorText}
    </template
`;

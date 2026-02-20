import { html } from '@ni/fast-element';
import type { SeverityPattern } from './types';
import { overflow } from '../../utilities/directive/overflow';

export const severityTextTemplate = html<SeverityPattern>`
    <div
        class="severity-text"
        ${overflow('severityHasOverflow')}
        title="${x => (x.severityHasOverflow && x.severityText ? x.severityText : undefined)}"
        aria-live="polite"
    >
        ${x => x.severityText}
    </div>
`;

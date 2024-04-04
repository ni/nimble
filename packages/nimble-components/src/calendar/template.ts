import { type ViewTemplate, html } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import 'cally';
import type { Calendar } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Calendar>> = () => html`
    <template
    >
        <calendar-month>
        </calendar-month>
    </template>
`;

import { type ViewTemplate, html } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import 'cally';
import type { DatePicker } from '.';
import { buttonTag } from '../button';
import { iconArrowExpanderLeftTag } from '../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../icons/arrow-expander-right';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<DatePicker>> = () => html`
    <template
    >
        <calendar-date
        >
            <${buttonTag} slot="previous" content-hidden name="chevron-left">
                <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
            </${buttonTag}>
            <${buttonTag} slot="next" content-hidden name="chevron-right">
                <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
            </${buttonTag}>
            <calendar-month></calendar-month>
        </calendar-date>
    </template>
`;

import type {
    FoundationElementTemplate,
    TextFieldOptions
} from '@microsoft/fast-foundation';
import { html, ref, when, type ViewTemplate } from '@microsoft/fast-element';
import type { DateTimePicker } from '.';
import { textFieldTag } from '../text-field';
import { iconCalendarTag } from '../icons/calendar';
import { buttonTag } from '../button';
import { anchoredRegionTag } from '../anchored-region';
import { iconThreeDotsLineTag } from '../icons/three-dots-line';

export const dateTimePickerTemplate: FoundationElementTemplate<
ViewTemplate<DateTimePicker>,
TextFieldOptions
> = (_context, _definition) => html`
    <template
    @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <div class="root">
            <${textFieldTag} appearance="${x => x.appearance}" readonly error-text="${x => x.errorText}" ?error-visible="${x => x.errorVisible}" ${ref('textField')}>
                <slot></slot>
                <${buttonTag} class="calendar-button" appearance="ghost" slot="actions" @click="${x => x.onCalendarButtonClick()}">
                    <${iconCalendarTag}>
                    </${iconCalendarTag}>
                </${buttonTag}>
                <${buttonTag} class="calendar-button" appearance="ghost" slot="actions" @click="${x => x.onMoreButtonClick()}">
                    <${iconThreeDotsLineTag}>
                    </${iconThreeDotsLineTag}>
                </${buttonTag}>
            </${textFieldTag}>
            <input type="datetime-local" @change="${x => x.onDateTimeInputChange()}" ${ref('dateTimeLocalInput')}>
            </input>
            ${when(
        x => x.popupOpen,
        html<DateTimePicker>`
            <${anchoredRegionTag} ${ref('anchoredRegion')}
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-inset="true"
                horizontal-positioning-mode="dynamic"
                vertical-positioning-mode="dynamic"
            >
                <table>
                <tbody>
                <tr>
                <td>Date</td>
                <td>Time</td>
                </tr>
                <tr>
                <td>
                    <input type="date" placeholder="YYYY-MM-DD" @change="${x => x.onDateInputChange()}" ${ref('dateInput')}>
                    </input>
                </td>
                <td>
                    <input type="time" placeholder="hh:mm" @change="${x => x.onTimeInputChange()}" ${ref('timeInput')}>
                    </input>
                </td>
                </tr>
                </tbody>
                </table>
            </${anchoredRegionTag}>
        `
    )}
        </div>
    </template>
`;

import { html, ref, repeat, slotted, when } from '@ni/fast-element';
import { whitespaceFilter } from '@ni/fast-foundation';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { iconCalendarDaysTag } from '@ni/nimble-components/dist/esm/icons/calendar-days';
import { iconArrowExpanderLeftTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import { errorTextTemplate } from '@ni/nimble-components/dist/esm/patterns/error/template';
import { createRequiredVisibleLabelTemplate } from '@ni/nimble-components/dist/esm/patterns/required-visible/template';
import type { FvDateTimePicker } from '.';

const label = createRequiredVisibleLabelTemplate(html<FvDateTimePicker>`
    <label part="label" for="control"
        class="${x => (x.defaultSlottedNodes?.length > 0 ? 'label' : 'label label__hidden')}">
        <slot ${slotted({ property: 'defaultSlottedNodes', filter: whitespaceFilter })}></slot>
    </label>
`);

const dayTemplate = html<Date, { picker: FvDateTimePicker }>`
    <td role="gridcell" aria-selected="${(x, c) => c.parent.picker.isSelected(x)}">
        <button type="button" class="day"
            data-date="${(x, c) => c.parent.picker.dateKey(x)}"
            tabindex="${(x, c) => (c.parent.picker.dateKey(x) === c.parent.picker.focusedDate ? 0 : -1)}"
            ?disabled="${(x, c) => c.parent.picker.isDayDisabled(x)}"
            aria-label="${(x, c) => c.parent.picker.dayLabel(x)}"
            aria-current="${(x, c) => (c.parent.picker.isToday(x) ? 'date' : null)}"
            ?data-outside-month="${(x, c) => x.getUTCMonth() !== c.parent.picker.visibleDate.getUTCMonth()}"
            @click="${(x, c) => c.parent.picker.selectDay(x)}"
            @keydown="${(x, c) => c.parent.picker.handleDayKeydown(c.event as KeyboardEvent, x)}">
            <span class="day-label">${x => x.getUTCDate()}</span>
        </button>
    </td>
`;

export const template = html<FvDateTimePicker>`
    <template class="${x => (x.readOnly ? 'readonly' : '')}"
        @keydown="${(x, c) => x.handleKeydown(c.event as KeyboardEvent)}"
        @focusout="${x => x.handleFocusout()}">
        ${label}
        <div class="root" part="root" ${ref('field')}>
            <input id="control" class="control" part="control" type="text"
                placeholder="${x => x.placeholder ?? x.inputPlaceholder}"
                autocomplete="${x => x.autocomplete}"
                spellcheck="false"
                lang="${x => x.locale}" dir="${x => (x.rtl ? 'rtl' : 'ltr')}"
                :value="${x => x.displayValue}"
                ?disabled="${x => x.disabled}" ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}" ?autofocus="${x => x.autofocus}"
                aria-label="${x => x.ariaLabel}"
                aria-labelledby="${x => x.ariaLabelledby}"
                aria-describedby="${x => x.ariaDescribedby}"
                aria-atomic="${x => x.ariaAtomic}"
                aria-busy="${x => x.ariaBusy}"
                aria-controls="${x => x.ariaControls}"
                aria-current="${x => x.ariaCurrent}"
                aria-details="${x => x.ariaDetails}"
                aria-disabled="${x => x.ariaDisabled}"
                aria-errormessage="${x => x.ariaErrormessage}"
                aria-flowto="${x => x.ariaFlowto}"
                aria-haspopup="${x => x.ariaHaspopup}"
                aria-hidden="${x => x.ariaHidden}"
                aria-invalid="${x => x.ariaInvalid}"
                aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
                aria-live="${x => x.ariaLive}"
                aria-owns="${x => x.ariaOwns}"
                aria-relevant="${x => x.ariaRelevant}"
                aria-roledescription="${x => x.ariaRoledescription}"
                aria-required="${x => x.requiredVisible}"
                @input="${x => x.handleTextInput()}"
                @paste="${(x, c) => x.handlePaste(c.event as ClipboardEvent)}"
                @change="${x => x.handleChange()}"
                ${ref('control')} />
            <span part="end">
                <${iconExclamationMarkTag} severity="error" class="error-icon"></${iconExclamationMarkTag}>
                <${buttonTag} type="button" appearance="ghost" content-hidden class="calendar-trigger" ${ref('trigger')}
                    aria-label="${x => x.pickerLabel}" aria-haspopup="dialog"
                    aria-expanded="${x => x.open}" aria-controls="picker"
                    ?disabled="${x => x.disabled || x.readOnly}"
                    @click="${x => x.togglePicker()}">
                    <${iconCalendarDaysTag} slot="start"></${iconCalendarDaysTag}>
                </${buttonTag}>
                ${errorTextTemplate}
            </span>
        </div>
        ${when(x => x.open, html<FvDateTimePicker>`
            <${anchoredRegionTag} ${ref('region')} fixed-placement auto-update-mode="auto"
                @loaded="${x => x.focusDay()}"
                vertical-default-position="bottom" vertical-positioning-mode="dynamic"
                horizontal-inset horizontal-viewport-lock vertical-viewport-lock
                horizontal-default-position="end" horizontal-positioning-mode="dynamic">
                <div id="picker" class="picker" part="picker" role="dialog" aria-label="${x => x.pickerLabel}"
                    dir="${x => (x.rtl ? 'rtl' : 'ltr')}"
                    @mousedown="${(x, c) => x.handlePickerMousedown(c.event as MouseEvent)}"
                    @input="${(x, c) => x.stopPickerEvent(c.event)}"
                    @change="${(x, c) => x.stopPickerEvent(c.event)}"
                    @keypress="${(x, c) => x.stopPickerEvent(c.event)}">
                    <div class="calendar-header">
                        <${selectTag} class="month" appearance="underline" aria-label="${x => x.localizedLabels.month}"
                            :value="${x => String(x.visibleDate.getUTCMonth())}"
                            @change="${(x, c) => x.changeMonth(c.event)}">
                            <span class="sr-only">${x => x.localizedLabels.month}</span>
                            ${repeat(x => x.months, html<string, FvDateTimePicker>`
                                <${listOptionTag} value="${(_, c) => c.index}">${x => x}</${listOptionTag}>
                            `, { positioning: true })}
                        </${selectTag}>
                        <${selectTag} class="year" appearance="underline"
                            aria-label="${x => x.localizedLabels.year}"
                            :value="${x => String(x.visibleDate.getUTCFullYear())}"
                            @change="${(x, c) => x.changeYear(c.event)}">
                            <span class="sr-only">${x => x.localizedLabels.year}</span>
                            ${repeat(x => x.years, html<number, FvDateTimePicker>`
                                <${listOptionTag} value="${x => x}"
                                    :selected="${(x, c) => x === c.parent.visibleDate.getUTCFullYear()}">${x => x}</${listOptionTag}>
                            `)}
                        </${selectTag}>
                        <${buttonTag} type="button" appearance="ghost" content-hidden
                            aria-label="${x => x.localizedLabels.previousMonth}" @click="${x => x.moveMonth(-1)}">
                            <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
                        </${buttonTag}>
                        <${buttonTag} type="button" appearance="ghost" content-hidden
                            aria-label="${x => x.localizedLabels.nextMonth}" @click="${x => x.moveMonth(1)}">
                            <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
                        </${buttonTag}>
                    </div>
                    <span class="sr-only" aria-live="polite">${x => x.monthLabel}</span>
                    <table role="grid" aria-label="${x => x.monthLabel}">
                        <thead>
                            <tr>
                                ${repeat(
x => x.weekdays,
        html<{ name: string, short: string }>`<th scope="col" abbr="${x => x.name}">${x => x.short}</th>`
)}
                            </tr>
                        </thead>
                        <tbody>
                            ${repeat(x => x.weeks, html<{ days: Date[], picker: FvDateTimePicker }>`
                                <tr>${repeat(x => x.days, dayTemplate, { positioning: true })}</tr>
                            `)}
                        </tbody>
                    </table>
                    <div class="time-row">
                        ${when(x => x.type === 'datetime-local', html<FvDateTimePicker>`
                            <${textFieldTag} id="time" class="time-field" appearance="outline"
                                placeholder="${x => x.timePlaceholder}" ${ref('timeField')}
                                :value="${x => x.timeDisplay}"
                                @input="${(x, c) => x.handleTimeInput(c.event)}"
                                @change="${(x, c) => x.changeTime(c.event)}">${x => x.localizedLabels.time}</${textFieldTag}>
                        `)}
                        <${buttonTag} type="button" appearance="ghost" @click="${x => x.closePicker()}">${x => x.localizedLabels.done}</${buttonTag}>
                    </div>
                </div>
            </${anchoredRegionTag}>
        `)}
    </template>
`;

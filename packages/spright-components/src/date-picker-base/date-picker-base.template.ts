/* eslint-disable import/no-extraneous-dependencies */
import type { ViewTemplate } from '@microsoft/fast-element';
import { html, ref, repeat, when } from '@microsoft/fast-element';
import { classNames } from '@microsoft/fast-web-utilities';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
// import { Popup } from '../../lib/popup/popup';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
// import { Divider } from '../../lib/divider/divider';
import { iconArrowExpanderLeftTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-left';
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/button/types';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import { iconCalendarDaysTag } from '@ni/nimble-components/dist/esm/icons/calendar-days';
import type { CalendarGridDate, Weekday } from './calendar/calendarGrid';
import { areMonthsEqual, monthToStr } from './calendar/month';
import type { MonthPickerGridCell } from './calendar/monthPickerGrid';
import type { DatePickerBase } from './date-picker-base';
import type {
    CalendarSegment,
    MonthPickerSegment,
    Segment,
} from './calendar/segment';

function renderDialogHeader(): ViewTemplate {
    return html<Segment, DatePickerBase>`<div class="header">
        ${when(
        x => x.prevYearButton,
        html<Segment, DatePickerBase>`
                    <${buttonTag}
                        tabindex="1"
                        class="header-button"
                        title="${(_, c) => c.parent.locale.datePicker.prevYearLabel}"
                        aria-label="${(_, c) => c.parent.locale.datePicker.prevYearLabel}"
                        ?disabled="${(_, c) => c.parent._isPrevYearDisabled}"
                        @click="${(_, c) => c.parent._onPrevYearClick()}"
                        content-hidden
                    >
                        <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
                    </${buttonTag}>
        `
    )}
        ${when(
        x => x.prevMonthButton,
        html<Segment, DatePickerBase>`
                    <${buttonTag}
                        tabindex="1"
                        class="header-button"
                        title="${(_, c) => c.parent.locale.datePicker.prevMonthLabel}"
                        aria-label="${(_, c) => c.parent.locale.datePicker.prevMonthLabel}"
                        ?disabled="${(_, c) => c.parent._isPrevMonthDisabled}"
                        @click="${(_, c) => c.parent._onPrevMonthClick()}"
                        content-hidden
                    >
                        <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
                    </${buttonTag}>
        `
    )}
        <div class="title">
            ${when(
        x => x.titleClickable,
        html<Segment, DatePickerBase>`
                    <${buttonTag}
                        tabindex="1"
                        id="${x => `grid-label-${x.id}`}"
                        class="title-action button"
                        aria-live="polite"
                        @click="${(_, c) => c.parent._onTitleActionClick()}"
                        appearance="${ButtonAppearance.ghost}"
                    >
                        ${x => x.title}
                    </${buttonTag}>
                `
    )}
            ${when(
        x => !x.titleClickable,
        html<Segment, DatePickerBase>`
                    <div
                        id="${x => `grid-label-${x.id}`}"
                        class="title-action"
                        aria-live="polite"
                    >
                        ${x => x.title}
                    </div>
                `
    )}
        </div>

        ${when(
        x => x.nextMonthButton,
        html<Segment, DatePickerBase>`
                <${buttonTag}
                    tabindex="1"
                    class="header-button"
                    title="${(_, c) => c.parent.locale.datePicker.nextMonthLabel}"
                    aria-label="${(_, c) => c.parent.locale.datePicker.nextMonthLabel}"
                    ?disabled="${(_, c) => c.parent._isNextMonthDisabled}"
                    @click="${(_, c) => c.parent._onNextMonthClick()}"
                    content-hidden
                >
                    <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
                </${buttonTag}>
            `
    )}
        ${when(
        x => x.nextYearButton,
        html<Segment, DatePickerBase>`
                <${buttonTag}
                    tabindex="1"
                    class="header-button"
                    title="${(_, c) => c.parent.locale.datePicker.nextYearLabel}"
                    aria-label="${(_, c) => c.parent.locale.datePicker.nextYearLabel}"
                    ?disabled="${(_, c) => c.parent._isNextYearDisabled}"
                    @click="${(_, c) => c.parent._onNextYearClick()}"
                    content-hidden
                >
                    <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
                </${buttonTag}>
            `
    )}
    </div>`;
}

function renderCalendarGrid(): ViewTemplate {
    const dividerTag = 'hr';

    return html<CalendarSegment, DatePickerBase>`<div
        class="calendar"
        role="grid"
        aria-labelledby="${x => `grid-label-${x.id}`}"
    >
        <div class="calendar-weekdays" role="row">
            ${repeat(
        x => x.calendar.weekdays,
        html<Weekday>`
                    <div
                        class="calendar-weekday"
                        role="columnheader"
                        aria-label="${x => x.name}"
                    >
                        ${x => x.shortName}
                    </div>
                `
    )}
        </div>
        <${dividerTag} class="calendar-separator" role="presentation"></${dividerTag}>
        ${repeat(
        x => x.calendar.grid,
        html<CalendarGridDate[]>` <div class="calendar-week" role="row">
                ${repeat(
        x => x,
        html<CalendarGridDate>`
            ${when(
        (x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._hideDatesOutsideMonth
                    && x.isOutsideMonth,
        html<CalendarGridDate>`<div class="calendar-day"></div>`
    )}
            ${when(
        (x, c) => !(c.parentContext.parentContext.parent as DatePickerBase)._hideDatesOutsideMonth
                    || !x.isOutsideMonth,
        html<CalendarGridDate>` <span role="gridcell">
                    <${buttonTag}
                        content-hidden
                        appearance="${(x, c) => ((c.parentContext.parentContext.parent as DatePickerBase)._isDateSelected(x.date) ? ButtonAppearance.block : ButtonAppearance.ghost)}"
                        class="${(x, c) => classNames(
        'calendar-day',
        'button',
        [
            'current',
            x.date === (c.parentContext.parentContext.parent as DatePickerBase)._currentDate,
        ],
        [
            'selected',
            (c.parentContext.parentContext.parent as DatePickerBase)._isDateSelected(x.date),
        ],
        [
            'range',
            (c.parentContext.parentContext.parent as DatePickerBase)._isDateInSelectedRange(
                x.date
            ),
        ],
        [
            'start',
            (c.parentContext.parentContext.parent as DatePickerBase)._isDateRangeStart(
                x.date
            ),
        ],
        [
            'end',
            (c.parentContext.parentContext.parent as DatePickerBase)._isDateRangeEnd(x.date),
        ],
        ['outside-month', x.isOutsideMonth]
    )}"
                        ?disabled="${(x, c) => !(c.parentContext.parentContext.parent as DatePickerBase)._isDateInValidRange(
        x.date
    )}"
                        tabindex="${(x, c) => ((x.date === (c.parentContext.parentContext.parent as DatePickerBase)._tabbableDate) ? 2 : -1)}"
                        aria-selected="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._isDateAriaSelected(x.date)}"
                        data-date="${x => x.date}"
                        @click="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onDateClick(x.date)}"
                        @focus="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onDateFocus(x.date)}"
                        @mouseenter="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onDateMouseEnter(x.date)}"
                        @mouseleave="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onDateMouseLeave(x.date)}"
                        @keydown="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onDateKeydown(
        x.date,
        c.event as KeyboardEvent
    )}"
                    >
                        <span slot="start">${x => x.label}</span>
                    </${buttonTag}>
                </span>`
    )}
                </div>
            `
    )}
            </div>`
    )}`;
}
function renderMonthPickerGrid(): ViewTemplate {
    const dividerTag = 'hr';

    return html<MonthPickerSegment, DatePickerBase>`
        <${dividerTag}
            class="months-separator"
            role="presentation"
        ></${dividerTag}>
        <div
        class="month-grid"
        role="grid"
        aria-labelledby="grid-label"
    >
        ${repeat(
        x => x.months,
        html<MonthPickerGridCell[]>`
                <div class="months-row" role="row">
                    ${repeat(
        x => x,
        html<MonthPickerGridCell>`
                            <span role="gridcell">
                                <${buttonTag}
                                    appearance="${(x, c) => (areMonthsEqual(
        x.month,
        (c.parentContext.parentContext.parent as DatePickerBase)._selectedMonth
    ) ? ButtonAppearance.block : ButtonAppearance.ghost)}"
                                    class="${(x, c) => classNames(
        'month',
        'button',
        [
            'current',
            areMonthsEqual(
                x.month,
                (c.parentContext.parentContext.parent as DatePickerBase)._currentMonth
            ),
        ],
        [
            'selected',
            areMonthsEqual(
                x.month,
                (c.parentContext.parentContext.parent as DatePickerBase)._selectedMonth
            ),
        ]
    )}"
                                    tabindex="${(x, c) => ((c.parentContext.parentContext.parent as DatePickerBase)._tabbableMonth
                                        && areMonthsEqual(
                                            x.month,
                                            (c.parentContext.parentContext.parent as DatePickerBase)._tabbableMonth!
                                        )
        ? 2
        : -1)}"
                                    aria-label="${x => x.monthName}"
                                    aria-selected="${(x, c) => areMonthsEqual(
        x.month,
        (c.parentContext.parentContext.parent as DatePickerBase)._selectedMonth
    )}"
                                    data-month="${x => monthToStr(x.month)}"
                                    ?disabled="${(x, c) => !(c.parentContext.parentContext.parent as DatePickerBase)._isMonthInValidRange(
        x.month
    )}"
                                    @click="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onMonthClick(
        x.month
    )}"
                                    @focus="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onMonthFocus(
        x.month
    )}"
                                    @keydown="${(x, c) => (c.parentContext.parentContext.parent as DatePickerBase)._onMonthKeydown(
        x.month,
        c.event as KeyboardEvent
    )}"
                                >
                                    ${x => x.label}
                                </${buttonTag}>
                            </span>
                        `
    )}
                </div>
            `
    )}
    </div>`;
}

export const datePickerBaseTemplate = html<DatePickerBase>`<div class="base" @keydown="${(x, { event }) => x._onBaseKeyDown(event as KeyboardEvent)}">
    <${textFieldTag} id="text-field"
                                        ${ref('_textFieldEl')}
                                        class="control"
                                        error-text="${x => x.errorValidationMessage}"
                                        ?error-visible="${x => x.errorValidationMessage}"
                                        placeholder="${x => x._textFieldPlaceholder}"
                                        current-value="${x => x._presentationValue}"
                                        ?disabled="${x => x.disabled}"
                                        ?readonly="${x => x.readOnly}"
                                        @input="${(x, c) => x._onTextFieldInput(c.event)}"
                                        @change="${x => x._onTextFieldChange()}"
    >
        ${x => x.label}

        <${buttonTag}
            id="calendar-button"
            ${ref('_calendarButtonEl')}
            slot="actions"
            appearance="${ButtonAppearance.ghost}"
            ?disabled="${x => x.disabled || x.readOnly}"
            title="${x => x._calendarButtonLabel}"
            aria-label="${x => x._calendarButtonLabel}"
            @click="${x => x._onCalendarButtonClick()}"
            content-hidden
        >
            <${iconCalendarDaysTag} slot="start"></${iconCalendarDaysTag}>
        </${buttonTag}>
    </${textFieldTag}>
    <${anchoredRegionTag}
                ?hidden="${x => !x._popupOpen}"
                :anchorElement="${x => x._textFieldEl}"
                class="popup">
        <div class="dialog" role="dialog" ${ref(
        '_dialogEl'
    )} aria-modal="true" aria-label="${x => x.locale.datePicker.chooseDateLabel}">
            <div class="segments">
                ${repeat(
        x => x._segments,
        html<Segment>` <div class="segment">
                        ${renderDialogHeader()}
                        ${when(
        x => x.type === 'month-picker',
        html<DatePickerBase>`${renderMonthPickerGrid()}`
    )}
                        ${when(
        x => x.type === 'calendar',
        html<DatePickerBase>`${renderCalendarGrid()}`
    )}
                    </div>`
    )}
            </div>
            <div class="footer">
                <${buttonTag}
                    tabindex="3"
                    @click="${x => x._onClearClick()},
                                    ${x => x.$emit('clear-click')}"
                >
                    ${x => x.locale.datePicker.clearLabel}
                </${buttonTag}>
                <${buttonTag}
                    tabindex="3"
                    appearance="${ButtonAppearance.block}"
                    appearance-variant="${ButtonAppearanceVariant.accent}"
                    @click="${x => x._onOkClick()}"
                >
                    ${x => x.locale.datePicker.okLabel}
                </${buttonTag}>
            </div>
        </div>
    </${anchoredRegionTag}>
</div>`;

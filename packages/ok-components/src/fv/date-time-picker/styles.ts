import { css } from '@ni/fast-element';
import { DesignToken } from '@ni/fast-foundation';
import { styles as textFieldStyles } from '@ni/nimble-components/dist/esm/text-field/styles';
import { theme } from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import {
    applicationBackgroundColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    buttonFillAccentColor,
    calendarEventBackgroundDynamicColor,
    calendarEventDynamicFontColor,
    controlHeight,
    controlLabelFontColor,
    elevation2BoxShadow,
    errorTextFont,
    failColor,
    fillSelectedColor,
    largePadding,
    mediumPadding,
    popupBorderColor,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

const selectedDayFill = DesignToken.create<string>('ok-fv-date-time-picker-selected-day-fill')
    .withDefault(element => (theme.getValueFor(element) === Theme.light
        ? calendarEventBackgroundDynamicColor.getValueFor(element)
        : buttonFillAccentColor.getValueFor(element)));

export const styles = css`
    ${textFieldStyles}

    :host {
        min-width: 240px;
    }

    ${/* Keep block height stable on hover so the open popup does not shift. */ ''}
    :host([appearance='block']:hover:not([error-visible])) .root:not(:focus-within) {
        padding-bottom: ${borderWidth};
    }

    .picker .day {
        position: relative;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: 100%;
        max-width: 100%;
        height: 40px;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
    }

    .day::before,
    .day::after {
        content: '';
        position: absolute;
        pointer-events: none;
    }

    .day::before {
        inset: 1px;
    }

    .day::after {
        inset: 0;
    }

    .day-label {
        position: relative;
    }

    .picker input:focus-visible {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -2px;
    }

    button:disabled {
        cursor: default;
        opacity: 0.3;
    }

    .calendar-trigger {
        ${controlHeight.cssCustomProperty}: 24px;
        flex: none;
    }

    nimble-anchored-region {
        padding-block: ${smallPadding};
    }

    .picker {
        box-sizing: border-box;
        width: 352px;
        max-width: calc(100vw - 2 * ${standardPadding});
        max-height: calc(100vh - 2 * ${standardPadding} - 2 * ${smallPadding});
        overflow: auto;
        padding: ${largePadding};
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: ${elevation2BoxShadow};
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    .calendar-header,
    .time-row {
        display: flex;
        align-items: center;
        gap: ${smallPadding};
    }

    .calendar-header {
        column-gap: ${mediumPadding};
        margin-bottom: ${standardPadding};
    }

    .picker input {
        min-width: 0;
        font: inherit;
        color: inherit;
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        padding: ${smallPadding};
    }

    .month,
    .year {
        flex: none;
        width: max-content;
        min-width: 0;
    }

    .year + nimble-button {
        margin-inline-start: auto;
    }

    .month-value {
        display: inline-grid;
    }

    .month-value > span {
        grid-area: 1 / 1;
    }

    .month-size {
        visibility: hidden;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    th {
        height: ${controlHeight};
        font-weight: normal;
        color: ${controlLabelFontColor};
    }

    td {
        padding: 0;
        text-align: center;
    }

    .day[data-outside-month] {
        color: ${bodyDisabledFontColor};
    }

    .day[aria-current='date']::after {
        border: 1px solid ${borderHoverColor};
    }

    [aria-selected='true'] .day {
        color: ${calendarEventDynamicFontColor};
    }

    [aria-selected='true'] .day::before {
        background: ${selectedDayFill};
    }

    .day:hover:not(:disabled)::after {
        border: 2px solid ${borderHoverColor};
    }

    .day:focus-visible {
        outline: none;
    }

    .day:focus-visible::after {
        inset: 3px;
        border: 2px solid ${borderHoverColor};
    }

    [aria-selected='true'] .day:hover,
    [aria-selected='true'] .day:focus-visible {
        color: ${bodyFontColor};
    }

    [aria-selected='true'] .day:hover::before {
        inset: 5px;
        background: ${fillSelectedColor};
    }

    [aria-selected='true'] .day:focus-visible::before {
        inset: 6px;
        background: ${fillSelectedColor};
    }

    .day:active:not(:disabled)::before {
        inset: 3px;
        background: ${fillSelectedColor};
    }

    .day:active:not(:disabled)::after {
        inset: 0;
        border: 1px solid ${borderHoverColor};
    }

    .day:active:not(:disabled) {
        color: ${bodyFontColor};
    }

    .time-row {
        margin-top: ${standardPadding};
    }

    .time-field {
        flex: 1;
        min-width: 0;
    }

    .entry-error {
        color: ${failColor};
        font: ${errorTextFont};
    }

    input::selection,
    .time-field::part(control)::selection {
        background: ${fillSelectedColor};
        color: ${bodyFontColor};
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
    }
`;

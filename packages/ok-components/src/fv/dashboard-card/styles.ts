import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    bodyPlus1EmphasizedFont,
    bodyPlus1EmphasizedFontColor,
    borderWidth,
    cardBorderColor,
    elevation1BoxShadow,
    failColor,
    iconColor,
    informationColor,
    passColor,
    sectionBackgroundColor,
    smallPadding,
    standardPadding,
    subtitleFont,
    subtitleFontColor,
    titleFont,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    warningColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        display: block;
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    .card-shell {
        box-sizing: border-box;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: ${standardPadding};
        min-width: 0;
        padding: ${standardPadding};
        border: ${borderWidth} solid ${cardBorderColor};
        border-radius: var(--ok-fv-dashboard-card-border-radius, 8px);
        background: ${sectionBackgroundColor};
        box-shadow: ${elevation1BoxShadow};
    }

    .card-shell [hidden] {
        display: none;
    }

    .header-row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: ${standardPadding};
        min-width: 0;
    }

    .title-group {
        display: grid;
        gap: ${smallPadding};
        min-width: 0;
        flex: 1 1 10rem;
        overflow-wrap: anywhere;
    }

    ::slotted([slot='context']),
    ::slotted([slot='title']),
    ::slotted([slot='subtitle']) {
        margin: 0;
    }

    .title-group ::slotted([slot='context']) {
        color: ${tooltipCaptionFontColor};
        font: ${tooltipCaptionFont};
        text-transform: uppercase;
    }

    .title-group ::slotted([slot='title']) {
        color: ${bodyPlus1EmphasizedFontColor};
        font: ${bodyPlus1EmphasizedFont};
    }

    .title-group ::slotted([slot='subtitle']) {
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    .content {
        display: grid;
        gap: ${smallPadding};
        min-width: 0;
    }

    .supporting {
        color: ${subtitleFontColor};
        font: ${subtitleFont};
    }

    .footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: ${smallPadding};
        padding-top: ${smallPadding};
        border-top: ${borderWidth} solid ${cardBorderColor};
    }

    .card-shell.has-icon {
        grid-template-columns: auto minmax(0, 1fr);
    }

    .has-icon > :not(.icon) {
        grid-column: 2;
    }

    .icon {
        grid-column: 1;
        grid-row: 1;
        display: flex;
        align-items: flex-start;
        color: var(--ok-private-dashboard-card-status-color, ${bodyFontColor});
        ${iconColor.cssCustomProperty}: currentColor;
    }

    .icon.align-title {
        align-self: start;
        align-items: center;
        min-height: 1lh;
        font: ${bodyPlus1EmphasizedFont};
    }

    .header-end,
    .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: ${smallPadding};
    }

    .header-end {
        margin-inline-start: auto;
    }

    :host([layout='hero']) .card-shell {
        border: 0;
        box-shadow: none;
    }

    :host([layout='hero']) ::slotted([slot='title']) {
        font: ${titleFont};
    }

    :host([layout='hero']) .icon.align-title {
        font: ${titleFont};
    }

    :host([layout='hero']) .supporting {
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    :host([corners='square']) .card-shell {
        border-radius: 0;
    }

    :host([severity='critical']) {
        --ok-private-dashboard-card-status-color: ${failColor};
    }

    :host([severity='warning']) {
        --ok-private-dashboard-card-status-color: ${warningColor};
    }

    :host([severity='information']) {
        --ok-private-dashboard-card-status-color: ${informationColor};
    }

    :host([severity='success']) {
        --ok-private-dashboard-card-status-color: ${passColor};
    }

    :host([severity='critical']) .card-shell,
    :host([severity='warning']) .card-shell,
    :host([severity='information']) .card-shell,
    :host([severity='success']) .card-shell {
        border-inline-start: ${smallPadding} solid var(--ok-private-dashboard-card-status-color);
    }
`;

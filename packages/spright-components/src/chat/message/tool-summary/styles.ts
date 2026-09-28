import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth,
    controlHeight,
    failColor,
    fillDownColor,
    fillHoverColor,
    iconColor,
    mediumPadding,
    passColor,
    smallPadding,
    standardPadding,
    warningColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../utilities/style/display';
import { chatToolCallTag } from './tool-call';

export const styles = css`
    ${display('block')}

    :host {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    .summary-button {
        display: flex;
        align-items: center;
        gap: ${mediumPadding};
        width: 100%;
        min-height: ${controlHeight};
        box-sizing: border-box;
        border: ${borderWidth} solid ${borderColor};
        border-radius: 4px;
        padding: ${smallPadding} ${standardPadding};
        color: inherit;
        background: transparent;
        font: inherit;
        text-align: start;
        cursor: pointer;
    }

    .summary-button:hover {
        background: ${fillHoverColor};
    }

    .summary-button:active {
        background: ${fillDownColor};
    }

    .summary-button:focus-visible {
        outline: 2px solid ${iconColor};
        outline-offset: 2px;
    }

    .status-icon {
        display: inline-flex;
        flex: 0 0 auto;
        color: ${iconColor};
    }

    .status-icon > * {
        width: 16px;
        height: 16px;
    }

    :host(:has(${chatToolCallTag}[status='success'])) .status-icon {
        color: ${passColor};
    }

    :host(:has(${chatToolCallTag}[status='warning'])) .status-icon {
        color: ${warningColor};
    }

    :host(:has(${chatToolCallTag}[status='error'])) .status-icon,
    :host(:has(${chatToolCallTag}[status='terminated'])) .status-icon {
        color: ${failColor};
    }

    .summary-label {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .disclosure-icon {
        flex: 0 0 auto;
        margin-inline-start: auto;
        transition: transform 120ms ease-out;
    }

    :host([expanded]) .disclosure-icon {
        transform: rotate(180deg);
    }

    .tool-call-list {
        border: ${borderWidth} solid ${borderColor};
        border-block-start: 0;
        border-radius: 0 0 4px 4px;
        min-width: 0;
    }

    .tool-call-list ::slotted(${chatToolCallTag}:not(:last-child)) {
        border-block-end: ${borderWidth} solid ${borderColor};
    }

    [hidden],
    .empty-slot {
        display: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .disclosure-icon {
            transition: none;
        }
    }
`;
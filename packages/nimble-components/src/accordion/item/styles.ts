import { css } from '@ni/fast-element';
import {
    controlHeight,
    fillHoverColor,
    mediumPadding,
    smallPadding,
    borderWidth,
    dividerBackgroundColor,
    failColor,
    borderHoverColor,
    bodyFont,
    bodyFontColor,
    bodyDisabledFontColor
} from '../../theme-provider/design-tokens';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    :host {
        display: block;
    }

    .control {
        display: flex;
        align-items: center;
        gap: ${smallPadding};
        width: 100%;
        min-height: ${controlHeight};
        height: ${controlHeight};
        padding: 0 ${mediumPadding};
        background: transparent;
        color: ${bodyFontColor};
        font: ${bodyFont};
        border: none;
        text-align: left;
        cursor: pointer;
    }

    :host(:not([disabled])) .control:hover {
        background: ${fillHoverColor};
        /* inner ring to match hover outline without being clipped by parent overflow */
        box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
    }

    .control${focusVisible} {
        /* Double ring entirely inside the header bounds so it isn't clipped */
        box-shadow:
            0 0 0 calc(${borderWidth} * 2) ${borderHoverColor} inset,
            0 0 0 ${borderWidth} ${borderHoverColor} inset;
    }

    .heading {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    [part='start'],
    [part='end'] {
        display: contents;
    }

    .icon {
        margin-inline-start: auto;
        color: currentColor;
        transition: transform 200ms ease;
        display: inline-flex;
    }

    :host([expanded]) .icon {
        transform: rotate(180deg);
    }

    .region {
        border-top: ${borderWidth} solid ${dividerBackgroundColor};
        padding: ${smallPadding} ${mediumPadding};
    }

    :host([error-visible]) .control {
        background: color-mix(in oklab, ${failColor} 10%, transparent);
    }
    :host([error-visible]) ::slotted([slot='end']) {
        color: ${failColor};
    }
    :host([error-visible]:not([disabled])) .control:hover {
        box-shadow: 0 0 0 ${borderWidth} ${failColor} inset;
    }
    :host([error-visible]) .control${focusVisible} {
        box-shadow:
            0 0 0 calc(${borderWidth} * 2) ${failColor} inset,
            0 0 0 ${borderWidth} ${failColor} inset;
    }

    :host([disabled]) .control {
        cursor: not-allowed;
        color: ${bodyDisabledFontColor};
        background: transparent;
        box-shadow: none;
    }
`;

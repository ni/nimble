import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    fillSelectedRgbPartialColor,
    controlLabelFont,
    controlLabelFontColor,
    labelHeight,
    smallDelay,
    bodyFont,
    failColor,
    standardPadding,
    controlLabelDisabledFontColor
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { NumberFieldAppearance } from './types';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        color: ${bodyFontColor};
        height: calc(${labelHeight} + ${controlHeight});
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
        cursor: default;
    }

    .label {
        display: flex;
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        border-radius: 0px;
        border: 0px solid rgba(${borderRgbPartialColor}, 0.3);
        gap: calc(${standardPadding} / 2);
    }

    .root:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    :host([disabled]) .root {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    .root::before {
        ${/* Empty string causes alignment issue */ ''}
        content: ' ';
        color: transparent;
        width: 0px;
        user-select: none;
    }

    .root::after {
        content: '';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        border-bottom: ${borderHoverColor}
            var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        .root::after {
            transition-duration: 0s;
        }
    }

    :host(.invalid) .root::after {
        border-bottom-color: ${failColor};
    }

    :host(:hover) .root::after {
        width: 100%;
    }

    :host([disabled]:hover) .root::after {
        width: 0px;
    }

    [part='start'] {
        display: contents;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        color: inherit;
        height: ${controlHeight};
        width: 100%;
        border: none;
        padding: 0px;
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control::selection {
        color: ${controlLabelFontColor};
        background: rgba(${fillSelectedRgbPartialColor}, 0.3);
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control:focus-within::placeholder {
        opacity: 1;
    }

    .control[disabled]::placeholder {
        color: ${bodyDisabledFontColor};
    }

    .controls {
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        align-items: center;
    }

    .step-up-down-button {
        ${controlHeight.cssCustomProperty}: 24px;
    }
`.withBehaviors(
        appearanceBehavior(
            NumberFieldAppearance.underline,
            css`
            .root {
                border-bottom-width: ${borderWidth};
                padding-top: ${borderWidth};
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            .control {
                height: calc(${controlHeight} - 2 * ${borderWidth});
            }
        `
        ),
        appearanceBehavior(
            NumberFieldAppearance.block,
            css`
            .root {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            .root:focus-within,
            :host(.invalid) .root {
                border-bottom-width: ${borderWidth};
            }

            :host([disabled]) .root {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }
        `
        ),
        appearanceBehavior(
            NumberFieldAppearance.outline,
            css`
            .root {
                border-width: ${borderWidth};
            }

            .control {
                height: calc(${controlHeight} - 2 * ${borderWidth});
            }
        `
        )
    );

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
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
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-block')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        color: ${bodyFontColor};
        height: calc(${labelHeight} + ${controlHeight});
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        --ni-private-height-within-border: calc(
            ${controlHeight} - 2 * ${borderWidth}
        );
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
        align-items: center;
        border-radius: 0px;
        border: 0px solid rgba(${borderRgbPartialColor}, 0.3);
        padding: ${borderWidth};
    }

    .root:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    :host([disabled]) .root {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([error-visible]) .root {
        border-bottom-color: ${failColor};
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

    :host([error-visible]) .root::after {
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
        height: var(--ni-private-height-within-border);
        width: 100%;
        border: none;
        padding: 0px;
        padding-left: calc(${standardPadding} / 2);
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control[disabled]::placeholder {
        color: ${bodyDisabledFontColor};
    }

    .controls {
        display: contents;
    }

    ${
        /* We are using flex `order` to define the visual ordering of the inc/dec buttons
         and the invalid icon because they are not "interactive" i.e. part of the tab order */ ''
    }
    .step-up {
        order: 3;
        padding-right: calc(${standardPadding} / 4);
    }

    .step-down {
        order: 2;
    }

    .step-up-down-button {
        ${controlHeight.cssCustomProperty}: 24px;
    }

    [part='end'] {
        display: contents;
    }

    .error-icon {
        order: 1;
        padding-right: calc(${standardPadding} / 4);
    }
`.withBehaviors(
    appearanceBehavior(
        NumberFieldAppearance.underline,
        css`
            .root {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }
        `
    ),
    appearanceBehavior(
        NumberFieldAppearance.block,
        css`
            .root {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .root:focus-within,
            :host([error-visible]) .root {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }

            :host(:hover) .root {
                padding-bottom: 0;
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
                padding: 0;
            }
        `
    )
);

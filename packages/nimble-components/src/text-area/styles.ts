import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    smallDelay,
    bodyFontColor,
    bodyDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor,
    bodyFont,
    controlLabelDisabledFontColor,
    iconSize,
    failColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextAreaAppearance } from './types';
import { styles as errorStyles } from '../patterns/error/styles';
import { userSelectNone } from '../utilities/style/user-select';

export const styles = css`
    ${display('inline-flex')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        outline: none;
        ${userSelectNone}
        color: ${bodyFontColor};
        flex-direction: column;
        vertical-align: top;
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }

    .label {
        display: block;
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    .container {
        display: flex;
        justify-content: center;
        position: relative;
        height: 100%;
        width: 100%;
    }

    .container::after {
        content: ' ';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        border-bottom: ${borderHoverColor}
            var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        .container::after {
            transition-duration: 0s;
        }
    }

    :host([error-visible]) .container::after {
        border-bottom-color: ${failColor};
    }

    :host(:hover) .container::after {
        width: 100%;
    }

    :host([disabled]:hover) .container::after,
    :host([readonly]:hover) .container::after {
        width: 0px;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        flex-grow: 1;
        outline: none;
        box-sizing: border-box;
        position: relative;
        color: inherit;
        border-radius: 0px;
        align-items: flex-end;
        border: ${borderWidth} solid transparent;
        min-width: 100px;
        min-height: calc(${iconSize} + ${standardPadding});
        padding: 8px;
        ${
            /* This padding ensures that showing/hiding the error icon doesn't affect text layout */ ''
        }
        padding-right: calc(${iconSize});
        margin: 0px;
        resize: none;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    .control[readonly],
    .control[readonly]:hover,
    .control[readonly]:hover:focus-within,
    .control[disabled],
    .control[disabled]:hover {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([error-visible]) .control {
        border-bottom-color: ${failColor};
    }

    :host([error-visible]) .control[readonly]:hover:focus-within {
        border-bottom-color: ${failColor};
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control[disabled]::placeholder {
        color: ${controlLabelDisabledFontColor};
    }

    :host([resize='both']) .control {
        resize: both;
    }
    :host([resize='horizontal']) .control {
        resize: horizontal;
    }
    :host([resize='vertical']) .control {
        resize: vertical;
    }

    :host([error-visible]) .error-icon {
        display: none;
    }

    :host([error-visible]) .error-icon.scrollbar-width-calculated {
        display: inline-flex;
        position: absolute;
        top: calc(${standardPadding} / 2);
        right: var(--ni-private-scrollbar-width);
    }
`.withBehaviors(
    appearanceBehavior(
        TextAreaAppearance.outline,
        css`
            .control {
                border-color: rgba(${borderRgbPartialColor}, 0.3);
                background-color: transparent;
            }
        `
    ),
    appearanceBehavior(
        TextAreaAppearance.block,
        css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            :host([readonly]) .control {
                background-color: transparent;
            }

            :host([disabled]) .control {
                border-color: transparent;
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            :host([error-visible][disabled]) .control {
                border-bottom-color: ${failColor};
            }
        `
    )
);

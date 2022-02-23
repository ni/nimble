import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    fillSelectedRgbPartialColor,
    smallDelay,
    bodyFontColor,
    bodyDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor,
    bodyFont,
    controlLabelDisabledFontColor
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextAreaAppearance } from './types';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        color: ${bodyFontColor};
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }

    .label {
        display: flex;
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        outline: none;
        box-sizing: border-box;
        position: relative;
        color: inherit;
        border-radius: 0px;
        align-items: flex-end;
        border: ${borderWidth} solid transparent;
        padding: 8px;
        transition: box-shadow ${smallDelay}, border ${smallDelay};
        resize: none;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:hover {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px 1px ${borderHoverColor};
    }

    .control:focus-within {
        border-color: ${borderHoverColor};
    }

    .control[readonly],
    .control[readonly]:hover,
    .control[readonly]:hover:focus-within,
    .control[disabled],
    .control[disabled]:hover {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
        box-shadow: none;
    }

    .control::selection {
        color: ${controlLabelFontColor};
        background: rgba(${fillSelectedRgbPartialColor}, 0.3);
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
`
    // prettier-ignore
    .withBehaviors(
        appearanceBehavior(
            TextAreaAppearance.Outline,
            css`
                .control {
                    border-color: rgba(${borderRgbPartialColor}, 0.3);
                    background-color: transparent;
                }
            `
        ),
        appearanceBehavior(
            TextAreaAppearance.Block,
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
            `
        )
    );

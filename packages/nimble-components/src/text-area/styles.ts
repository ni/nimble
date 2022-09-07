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
    controlLabelDisabledFontColor
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextAreaAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        color: ${bodyFontColor};
        flex-direction: column;
        vertical-align: top;
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

    .control {
        -webkit-appearance: none;
        font: inherit;
        width: 100%;
        flex-grow: 1;
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

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control[disabled]::placeholder {
        color: ${controlLabelDisabledFontColor};
    }

    :host([cols]) .control {
        width: auto;
    }

    :host([rows]) .control {
        flex: none;
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
            `
        )
    );

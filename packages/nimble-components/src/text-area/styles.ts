import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColorRgbPartial,
    borderColorHover,
    borderWidth,
    fillColorSelectedRgbPartial,
    smallDelay,
    bodyFontColor,
    bodyFontColorDisabled,
    controlLabelFont,
    controlLabelFontColor,
    bodyFont,
    controlLabelFontColorDisabled
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
        color: ${bodyFontColorDisabled};
    }

    .label {
        display: flex;
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelFontColorDisabled};
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
        transition: outline ${smallDelay}, border ${smallDelay};
        resize: none;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:hover {
        border-color: ${borderColorHover};
        outline: 1px solid ${borderColorHover};
    }

    .control:focus-within {
        border-color: ${borderColorHover};
    }

    .control[readonly],
    .control[readonly]:hover,
    .control[readonly]:hover:focus-within,
    .control[disabled],
    .control[disabled]:hover {
        border-color: rgba(${borderColorRgbPartial}, 0.1);
        outline: none;
    }

    .control::selection {
        color: ${controlLabelFontColor};
        background: rgba(${fillColorSelectedRgbPartial}, 0.3);
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control[disabled]::placeholder {
        color: ${controlLabelFontColorDisabled};
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
                    border-color: rgba(${borderColorRgbPartial}, 0.3);
                    background-color: transparent;
                }
            `
        ),
        appearanceBehavior(
            TextAreaAppearance.Block,
            css`
                .control {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                }

                :host([readonly]) .control {
                    background-color: transparent;
                }

                :host([disabled]) .control {
                    border-color: transparent;
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                }
            `
        )
    );

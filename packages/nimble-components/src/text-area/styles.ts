import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    actionColorRgbPartial,
    borderColorRgbPartial,
    borderColorHover,
    borderWidth,
    contentFontColor,
    contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    fillColorSelected,
    fillColorSelectedRgbPartial,
    fontFamily,
    labelFontColor,
    labelFontFamily,
    labelFontSize,
    labelFontWeight,
    labelHeight,
    labelTextTransform,
    smallDelay
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from './behaviors';
import { TextAreaAppearance } from './types';

export const styles = css`
    ${display('inline-block')}

    :host {
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        outline: none;
        user-select: none;
        color: ${contentFontColor};
        /*height: calc(${labelHeight} + ${controlHeight});*/
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
    }

    .control {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        font-family: ${fontFamily};
        /*border-bottom: ${borderWidth} solid rgba(${borderColorRgbPartial}, 0.3);*/
        padding-bottom: 1px;
        transition: border ${smallDelay}, padding-bottom ${smallDelay};
        align-items: flex-end;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        color: inherit;
        /*height: 28px;*/
        /*width: 100%;*/
        border: ${borderWidth} solid transparent;
        margin-top: auto;
        margin-bottom: auto;
        outline: none;
        /*border: none;*/
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:hover,
    .control${focusVisible} {
        border: 2px solid ${borderColorHover};
        /*box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;*/
    }

    :host([disabled]) .control,
    :host([disabled]) .control:hover {
        border: ${borderWidth} solid ${contentFontColorDisabled};
        /*padding-bottom: 1px;*/
    }

    :host([readonly]) .control,
    :host([readonly]) .control:hover {
        border: ${borderWidth} solid ${contentFontColorDisabled};
    }
    /*
    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }
*/
    .control::selection {
        color: ${labelFontColor};
        background: rgba(${fillColorSelectedRgbPartial}, 0.3);
    }

    .control::placeholder {
        color: ${labelFontColor};
    }

    .control:not([readonly]):focus-within::placeholder {
        opacity: 1;
    }

    .control[readonly] {
        cursor: default;
    }

    .control[disabled]::placeholder {
        color: ${contentFontColorDisabled};
    }

    .label {
        display: flex;
        color: ${labelFontColor};
        font-family: ${labelFontFamily};
        font-size: ${labelFontSize};
        font-weight: ${labelFontWeight};
        line-height: ${labelHeight};
        text-transform: ${labelTextTransform};
    }
`
    // prettier-ignore
    .withBehaviors(
        appearanceBehavior(
            TextAreaAppearance.Outline,
            css`
                .control {
                    background-color: transparent;
                    border-color: rgba(${borderColorRgbPartial}, 0.5);
                    /*border-color: rgba(${actionColorRgbPartial}, 0.5);*/
                }

                .control[disabled] {
                    border-color: rgba(${borderColorRgbPartial}, 0.2);
                }
            `
        ),
        appearanceBehavior(
            TextAreaAppearance.Block,
            css`
                .control {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                    border-color: transparent;
                }

                .control[disabled] {
                    border-color: rgba(${borderColorRgbPartial}, 0.1);
                }
            `
        )
    );

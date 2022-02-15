import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColorRgbPartial,
    borderColorHover,
    borderWidth,
    contentFontColor,
    contentFontColorDisabled,
    contentFontSize,
    fillColorSelectedRgbPartial,
    fontFamily,
    labelFontColor,
    labelFontColorDisabled,
    labelFontFamily,
    labelFontSize,
    labelFontWeight,
    labelHeight,
    labelTextTransform,
    smallDelay
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextAreaAppearance } from './types';

export const styles = css`
    ${display('inline-block')}

    :host {
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        outline: none;
        user-select: none;
        color: ${contentFontColor};
    }

    :host([disabled]) {
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

    :host([disabled]) .label {
        color: ${labelFontColorDisabled};
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
        --ni-private-hover-border-width: calc(${borderWidth} + 1px);
        --ni-private-current-border-width: ${borderWidth};
        border: var(--ni-private-current-border-width) solid transparent;
        padding: calc(9px - var(--ni-private-current-border-width));
        transition: border ${smallDelay}, padding ${smallDelay};
        resize: none;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:hover,
    .control:hover:focus-within {
        --ni-private-current-border-width: var(--ni-private-hover-border-width);
        border-color: ${borderColorHover};
    }

    .control:focus-within {
        --ni-private-current-border-width: ${borderWidth};
        border-color: ${borderColorHover};
    }

    .control[readonly],
    .control[readonly]:hover,
    .control[readonly]:hover:focus-within {
        --ni-private-current-border-width: ${borderWidth};
        border-color: rgba(${borderColorRgbPartial}, 0.1);
    }

    .control[disabled],
    .control[disabled]:hover {
        --ni-private-current-border-width: ${borderWidth};
        border-color: rgba(${borderColorRgbPartial}, 0.1);
    }

    .control::selection {
        color: ${labelFontColor};
        background: rgba(${fillColorSelectedRgbPartial}, 0.3);
    }

    .control::placeholder {
        color: ${labelFontColor};
    }

    .control[disabled]::placeholder {
        color: ${contentFontColorDisabled};
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
                    background-color: transparent;
                    border-color: rgba(${borderColorRgbPartial}, 0.3);
                }
            `
        ),
        appearanceBehavior(
            TextAreaAppearance.Block,
            css`
                .control {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                    --ni-private-current-border-width: 0px;
                    ${/* solves jiggle when leaving hover */ ''}
                    transition-duration: 0s;
                }

                :host([readonly]) .control,
                :host([readonly]) .control:hover,
                :host([disabled]) .control,
                :host([disabled]) .control:hover {
                    --ni-private-current-border-width: 0px;
                }
            `
        )
    );

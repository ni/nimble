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
    smallPadding,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextAreaAppearance } from './types';
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-flex')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        color: ${bodyFontColor};
        flex-direction: column;
        vertical-align: top;
        --ni-private-scrollbar-width: 17px;
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
        position: relative;
        height: 100%;
        width: 100%;
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
        padding: 8px;
        transition: border ${smallDelay};
        margin-bottom: 1px;
        resize: none;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control[style*='height:'] {
        ${
            /*
             * When the textarea is user-resizable, resizing it causes `style` to be
             * set to a fixed height/width. When the height is set to a fixed value,
             * increasing the border width (on hover) does not result in the control
             * height increasing. As a result, we don't need the compensation margin.
             */ ''
        }
        margin-bottom: 0px;
    }

    .control:hover {
        border-bottom-color: ${borderHoverColor};
        border-bottom-width: calc(${borderWidth} + 1px);
        margin-bottom: 0px;
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
        border-bottom-width: ${borderWidth};
        margin-bottom: 1px;
    }

    :host([error-visible]) .control {
        padding-right: calc(
            ${iconSize} + ${standardPadding} / 2 + ${smallPadding}
        );
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

    :host([error-visible]) .error-icon {
        position: absolute;
        top: calc(${standardPadding} / 2);
        right: calc(${standardPadding} / 2);
    }
    :host([error-visible].vert-scrollbar) .error-icon {
        right: calc(${standardPadding} / 2 + var(--ni-private-scrollbar-width));
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

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    failColor,
    fillSelectedRgbPartialColor,
    labelHeight,
    smallDelay,
    controlLabelFont,
    bodyFont,
    controlLabelFontColor,
    controlLabelDisabledFontColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextFieldAppearance } from './types';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-block')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        --webkit-user-select: none;
        color: ${bodyFontColor};
        height: calc(${labelHeight} + ${controlHeight});
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        --ni-private-height-within-border: calc(
            ${controlHeight} - 2 * ${borderWidth}
        );
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

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        font: inherit;
        align-items: center;
        justify-content: center;
        border: 0px solid rgba(${borderRgbPartialColor}, 0.3);
        gap: calc(${standardPadding} / 2);
    }

    :host([readonly]) .root {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([disabled]) .root {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host(.invalid) .root {
        border-bottom-color: ${failColor};
    }

    .root:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    :host([appearance='frameless'].clear-inline-padding) .root {
        padding-left: 0px;
        padding-right: 0px;
    }

    .root::before {
        ${/* Empty string causes alignment issue */ ''}
        content: ' ';
        color: transparent;
        width: 0px;
        user-select: none;
    }

    :host([appearance='frameless'].clear-inline-padding) .root::before {
        display: none;
    }

    .root::after {
        ${/* Empty string causes alignment issue */ ''}
        content: ' ';
        color: transparent;
        width: 0px;
        user-select: none;
    }

    :host([appearance='frameless'].clear-inline-padding) .root::after {
        display: none;
    }

    [part='start'] {
        display: contents;
    }

    slot[name='start']::slotted(*) {
        flex: none;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        color: inherit;
        padding: 0px;
        height: ${controlHeight};
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        text-overflow: ellipsis;
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control:disabled {
        ${
            /* There's an issue with the input element where the ellipsized
               overflowed text is blank when scrolled into view, so just clip instead.
               See https://webcompat.com/issues/104481 */ ''
        }
        text-overflow: clip;
    }

    .control::selection {
        color: ${controlLabelFontColor};
        background: rgba(${fillSelectedRgbPartialColor}, 0.3);
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control:not([readonly]):focus-within::placeholder {
        opacity: 1;
    }

    .control[disabled]::placeholder {
        color: ${bodyDisabledFontColor};
    }

    [part='end'] {
        display: contents;
    }

    [part='end']::after {
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
        [part='end']::after {
            transition-duration: 0s;
        }
    }

    :host(.invalid) [part='end']::after {
        border-bottom-color: ${failColor};
    }

    :host(:hover) [part='end']::after {
        width: 100%;
    }

    :host([disabled]:hover) [part='end']::after,
    :host([readonly]:hover) [part='end']::after {
        width: 0px;
    }

    [part='actions'] {
        display: contents;
    }

    slot[name='actions']::slotted(*) {
        ${controlHeight.cssCustomProperty}: 24px;
    }
`.withBehaviors(
                appearanceBehavior(
                    TextFieldAppearance.underline,
                    css`
            .root {
                border-bottom-width: ${borderWidth};
            }

            .control {
                height: var(--ni-private-height-within-border);
                padding-top: ${borderWidth};
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }
        `
                ),
                appearanceBehavior(
                    TextFieldAppearance.block,
                    css`
            .root {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .control {
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            .root:focus-within,
            :host(.invalid) .root {
                border-bottom-width: ${borderWidth};
            }

            .root:focus-within .control,
            :host(.invalid) .control {
                height: calc(${controlHeight} - ${borderWidth});
            }

            :host([readonly]) .root {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
                border-color: transparent;
            }

            :host([disabled]) .root {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }
        `
                ),
                appearanceBehavior(
                    TextFieldAppearance.outline,
                    css`
            .root {
                border-width: ${borderWidth};
            }

            .control {
                height: var(--ni-private-height-within-border);
            }
        `
                ),
                appearanceBehavior(
                    TextFieldAppearance.frameless,
                    css`
            .control {
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            :host([readonly]) .root {
                border-color: transparent;
            }
        `
                ),
                themeBehavior(
                    css`
            ${'' /* Light theme */}
            .control::-ms-reveal {
                filter: invert(0%);
            }
        `,
                    css`
            ${'' /* Dark theme */}
            .control::-ms-reveal {
                filter: invert(100%);
            }
        `,
                    // Color theme
                    Theme.dark
                )
            );

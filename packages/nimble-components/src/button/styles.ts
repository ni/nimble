import { css } from '@microsoft/fast-element';
import {
    borderColorHover,
    borderColorActive,
    controlHeight,
    standardPadding,
    fontFamily,
    fillColorSelected,
    contentFontSize,
    contentFontColorDisabled,
    contentFontColor,
    actionColorRgb
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from './behaviors';
import { ButtonAppearance } from './types';

export const styles = css`
    :host {
        display: inline-block;
        background-color: transparent;
        height: ${controlHeight};
        color: ${contentFontColor};
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        cursor: pointer;
        text-align: center;
        outline: none;
    }

    :host(:hover),
    :host(:focus-within) {
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
    }

    :host(:focus-within:not(:active)) {
        outline: 1px solid ${borderColorHover};
        outline-offset: -4px;
    }

    :host(:active) {
        background-color: ${fillColorSelected};
        box-shadow: none;
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
        background-color: transparent;
        box-shadow: none;
        cursor: default;
    }

    .control {
        background-color: transparent;
        height: inherit;
        border: 0px solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        padding: 0 ${standardPadding};
    }`.withBehaviors(
        appearanceBehavior(
            ButtonAppearance.Outline,
            css`
                :host {
                    border: 1px solid rgba(${actionColorRgb}, 0.3);
                }

                :host(:hover),
                :host(:focus-within) {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) {
                    border-color: ${borderColorActive};
                }

                :host([disabled]) {
                    border-color: rgba(${borderColorActive}, 0.2);
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Ghost,
            css`
                :host {
                    border: 1px solid transparent;
                }

                :host(:hover),
                :host(:focus-within) {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active),
                :host([disabled]) {
                    border-color: transparent;
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Block,
            css`
                :host {
                    border: 1px solid transparent;
                }

                :host(:not(:active)),
                :host([disabled]) {
                    background-color: rgba(${borderColorActive}, 0.1);
                }

                :host(:hover),
                :host(:focus-within) {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) {
                    border-color: ${borderColorActive};
                }

                :host([disabled]) {
                    ${
                        /* This opacity adds to the existing 10% background opacity. */ ''
                    }
                    border-color: rgba(${borderColorActive}, 0.1);
                }
            `
        ),
    );

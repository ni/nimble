import { css } from '@microsoft/fast-element';
import {
    borderColorRgb,
    borderColorHover,
    controlHeight,
    standardPadding,
    fontFamily,
    fontColor,
    fillColorSelected,
    contentFontSize
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/behaviors';
import { ButtonAppearance } from './types';

export const styles = css`
    :host {
        display: inline-block;
        background-color: transparent;
        height: ${controlHeight};
        color: ${fontColor};
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        cursor: pointer;
        text-align: center;
        outline: none;
    }

    :host(:hover),
    :host(:focus) {
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
    }

    :host(:focus:not(:active)) {
        outline: 1px solid ${borderColorHover};
        outline-offset: -4px;
    }

    :host(:active) {
        background-color: ${fillColorSelected};
        box-shadow: none;
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
                    border: 1px solid rgba(${borderColorRgb}, 0.3);
                }

                :host(:hover),
                :host(:focus) {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) {
                    border-color: transparent;
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
                :host(:focus) {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) {
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

                :host(:not(:active)) {
                    background-color: rgba(${borderColorRgb}, 0.1);
                }

                :host(:hover),
                :host(:focus) {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) {
                    border-color: transparent;
                }
            `
        ),
    );

import { css } from '@microsoft/fast-element';
import { focusVisible } from '@microsoft/fast-foundation';
import {
    borderColorHover,
    borderColorRgb,
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
        border: none;
        box-sizing: border-box;
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
        cursor: default;
    }

    .control {
        background-color: transparent;
        height: inherit;
        border: 1px solid transparent;
        box-sizing: border-box;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0;
        padding: 0 ${standardPadding};
    }

    .control:hover {
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
        outline: none;
    }

    .control:${focusVisible} {
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
        outline: 1px solid ${borderColorHover};
        outline-offset: -4px;
    }

    .control:active {
        box-shadow: none;
        outline: none;
    }

    .control[disabled] {
        box-shadow: none;
        outline: none;
    }

    `.withBehaviors(
        appearanceBehavior(
            ButtonAppearance.Outline,
            css`
                :host([appearance='${ButtonAppearance.Outline}']) .control {
                    background-color: transparent;
                    border-color: rgba(${actionColorRgb}, 0.3);
                }

                :host([appearance='${ButtonAppearance.Outline}']) .control:hover {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                :host([appearance='${ButtonAppearance.Outline}']) .control:${focusVisible} {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                :host([appearance='${ButtonAppearance.Outline}']) .control:active {
                    background-color: ${fillColorSelected};
                    border-color: transparent;
                }

                :host([appearance='${ButtonAppearance.Outline}']) .control[disabled] {
                    background-color: transparent;
                    border-color: rgba(${borderColorRgb}, 0.2);
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Ghost,
            css`
                :host([appearance='${ButtonAppearance.Ghost}']) .control {
                    background-color: transparent;
                    border-color: transparent;
                }

                :host([appearance='${ButtonAppearance.Ghost}']) .control:hover {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                :host([appearance='${ButtonAppearance.Ghost}']) .control:${focusVisible} {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                :host([appearance='${ButtonAppearance.Ghost}']) .control:active {
                    background-color: ${fillColorSelected};
                    border-color: transparent;
                }

                :host([appearance='${ButtonAppearance.Ghost}']) .control[disabled] {
                    background-color: transparent;
                    border-color: transparent;
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Block,
            css`
                :host([appearance='${ButtonAppearance.Block}']) .control {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: transparent;
                }

                :host([appearance='${ButtonAppearance.Block}']) .control:hover {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: ${borderColorHover};
                }

                :host([appearance='${ButtonAppearance.Block}']) .control:${focusVisible} {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: ${borderColorHover};
                }

                :host([appearance='${ButtonAppearance.Block}']) .control:active {
                    background-color: ${fillColorSelected};
                    border-color: transparent;
                }

                :host([appearance='${ButtonAppearance.Block}']) .control[disabled] {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: rgba(${borderColorRgb}, 0.1);
                }
            `
        ),
    );

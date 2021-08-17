import { css } from '@microsoft/fast-element';
import { focusVisible } from '@microsoft/fast-foundation';
import {
    borderColorRgb,
    borderColorHover,
    controlHeight,
    standardPadding,
    fontFamily,
    fontColor,
    fillColorSelected,
    contentFontSize,
    fontColorDisabled
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from './behaviors';
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
        border: none;
        box-sizing: border-box;
    }

    :host([disabled]) {
        color: ${fontColorDisabled};
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

    :host([disabled]) .control {
        box-shadow: none;
        outline: none;
    }

    `.withBehaviors(
        appearanceBehavior(
            ButtonAppearance.Outline,
            css`
                .control {
                    background-color: transparent;
                    border-color: rgba(${borderColorRgb}, 0.3);
                }

                .control:hover {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                .control:${focusVisible} {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                .control:active {
                    background-color: ${fillColorSelected};
                    border-color: transparent;
                }

                :host([disabled]) .control {
                    background-color: transparent;
                    border-color: rgba(${borderColorRgb}, 0.2);
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Ghost,
            css`
                .control {
                    background-color: transparent;
                    border-color: transparent;
                }

                .control:hover {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                .control:${focusVisible} {
                    background-color: transparent;
                    border-color: ${borderColorHover};
                }

                .control:active {
                    background-color: ${fillColorSelected};
                    border-color: transparent;
                }

                :host([disabled]) .control {
                    background-color: transparent;
                    border-color: transparent;
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Block,
            css`
                .control {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: transparent;
                }

                .control:hover {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: ${borderColorHover};
                }

                .control:${focusVisible} {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: ${borderColorHover};
                }

                .control:active {
                    background-color: ${fillColorSelected};
                    border-color: transparent;
                }

                :host([disabled]) .control {
                    background-color: rgba(${borderColorRgb}, 0.1);
                    border-color: rgba(${borderColorRgb}, 0.1);
                }
            `
        ),
    );

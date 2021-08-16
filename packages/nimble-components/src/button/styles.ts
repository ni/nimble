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
    }

    :host(:hover) .control,
    .control:${focusVisible} {
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
    }

    .control:${focusVisible}:not(:active) {
        outline: 1px solid ${borderColorHover};
        outline-offset: -4px;
    }

    :host(:active:not([disabled])) {
        background-color: ${fillColorSelected};
    }

    :host(:active) .control {
        box-shadow: none;
    }

    :host([disabled]) {
        color: ${fontColorDisabled};
        cursor: default;
    }

    :host([disabled]) .control {
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
        margin: 0;
        padding: 0 ${standardPadding};
    }`.withBehaviors(
        appearanceBehavior(
            ButtonAppearance.Outline,
            css`
                :host .control {
                    border: 1px solid rgba(${borderColorRgb}, 0.3);
                }

                :host(:hover) .control,
                .control:${focusVisible} {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) .control {
                    border-color: transparent;
                }

                :host([disabled]) .control {
                    border-color: rgba(${borderColorRgb}, 0.2);
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Ghost,
            css`
                :host .control {
                    border: 1px solid transparent;
                }

                :host(:hover) .control,
                .control:${focusVisible} {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) .control,
                :host([disabled]) .control {
                    border-color: transparent;
                }
            `
        ),
        appearanceBehavior(
            ButtonAppearance.Block,
            css`
                :host .control {
                    border: 1px solid transparent;
                }

                :host(:not(:active)),
                :host([disabled]) {
                    background-color: rgba(${borderColorRgb}, 0.1);
                }

                :host(:hover) .control,
                .control:${focusVisible} {
                    border: 1px solid ${borderColorHover};
                }

                :host(:active) .control {
                    border-color: transparent;
                }

                :host([disabled]) .control {
                    ${
                        /* This opacity adds to the existing 10% background opacity. */ ''
                    }
                    border-color: rgba(${borderColorRgb}, 0.1);
                }
            `
        ),
    );

import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';
import {
    borderColorHover,
    borderColorRgb,
    controlHeight,
    standardPadding,
    fontFamily,
    fillColorSelected,
    contentFontSize,
    contentFontColorDisabled,
    buttonContentFontColor,
    actionColorRgb,
    borderWidth,
    smallDelay
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from './behaviors';
import { ButtonAppearance } from './types';

export const styles = css`
    :host {
        display: inline-flex;
        background-color: transparent;
        height: ${controlHeight};
        color: ${buttonContentFontColor};
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        cursor: pointer;
        outline: none;
        border: none;
        box-sizing: border-box;
        /* Not sure why but this is needed to get buttons with icons and
        buttons without icons to align on the same line when the button is inline-flex */
        vertical-align: middle;
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
        cursor: default;
    }

    .control {
        background-color: transparent;
        height: inherit;
        width: inherit;
        border: ${borderWidth} solid transparent;
        box-sizing: border-box;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: inherit;
        font-family: inherit;
        font-size: inherit;
        outline: none;
        margin: 0;
        padding: 0 ${standardPadding};
        transition: box-shadow ${smallDelay};
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:hover {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;
        outline: none;
    }

    .control${focusVisible} {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;
        outline: ${borderWidth} solid ${borderColorHover};
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

    .content {
        display: inline-flex;
    }

    [part="start"] {
        display: none;
    }

    [part="start"].icon {
        display: inline-flex;
    }

    [part="icon"] {
        display: contents;
    }

    slot[name="icon"]::slotted(*) {
        width: 16px;
        height: 16px;
        fill: ${buttonContentFontColor};
    }

    [part="end"] {
        display: none;
    }

    :host([disabled]) slot[name="icon"]::slotted(*) {
        opacity: 0.6;
    }
`.withBehaviors(
        appearanceBehavior(
            ButtonAppearance.Outline,
            css`
            .control {
                background-color: transparent;
                border-color: rgba(${actionColorRgb}, 0.3);
            }

            .control:hover {
                background-color: transparent;
                border-color: ${borderColorHover};
            }

            .control${focusVisible} {
                background-color: transparent;
                border-color: ${borderColorHover};
            }

            .control:active {
                background-color: ${fillColorSelected};
                border-color: transparent;
            }

            .control[disabled] {
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

            .control${focusVisible} {
                background-color: transparent;
                border-color: ${borderColorHover};
            }

            .control:active {
                background-color: ${fillColorSelected};
                border-color: transparent;
            }

            .control[disabled] {
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

            .control${focusVisible} {
                background-color: rgba(${borderColorRgb}, 0.1);
                border-color: ${borderColorHover};
            }

            .control:active {
                background-color: ${fillColorSelected};
                border-color: transparent;
            }

            .control[disabled] {
                background-color: rgba(${borderColorRgb}, 0.1);
                border-color: rgba(${borderColorRgb}, 0.1);
            }
        `
        )
    );

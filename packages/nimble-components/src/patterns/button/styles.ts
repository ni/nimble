import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../../utilities/style/focus';
import {
    actionColorRgbPartial,
    borderColorHover,
    borderColorRgbPartial,
    borderWidth,
    buttonContentFontColor,
    contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    fillColorSelected,
    fontFamily,
    iconColor,
    smallDelay,
    standardPadding
} from '../../theme-provider/design-tokens';
import { appearanceBehavior } from '../../utilities/style/appearance';
import { ButtonAppearance } from './types';

export const buttonStyles = css`
    ${display('inline-flex')}

    :host {
        background-color: transparent;
        height: ${controlHeight};
        color: ${buttonContentFontColor};
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        cursor: pointer;
        outline: none;
        border: none;
        box-sizing: border-box;
        ${
            /*
                Not sure why but this is needed to get buttons with icons and buttons
                without icons to align on the same line when the button is inline-flex
                See: https://github.com/microsoft/fast/issues/5414
            */ ''
        }
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

    :host([content-hidden]) .control {
        width: ${controlHeight};
        padding: 0px;
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
        display: contents;
    }

    :host([content-hidden]) .content {
        display: none;
    }

    [part='start'] {
        display: contents;
    }

    slot[name='start']::slotted(*) {
        ${iconColor.cssCustomProperty}: ${buttonContentFontColor};
    }

    :host([disabled]) slot[name='start']::slotted(*) {
        opacity: 0.6;
    }

    [part='end'] {
        display: none;
    }
`
    // prettier-ignore
    .withBehaviors(
        appearanceBehavior(
            ButtonAppearance.Outline,
            css`
                .control {
                    background-color: transparent;
                    border-color: rgba(${actionColorRgbPartial}, 0.3);
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
                    border-color: ${fillColorSelected};
                }

                .control[disabled] {
                    background-color: transparent;
                    border-color: rgba(${borderColorRgbPartial}, 0.2);
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
                    border-color: ${fillColorSelected};
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
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                    border-color: transparent;
                }

                .control:hover {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                    border-color: ${borderColorHover};
                }

                .control${focusVisible} {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                    border-color: ${borderColorHover};
                }

                .control:active {
                    background-color: ${fillColorSelected};
                    border-color: ${fillColorSelected};
                }

                .control[disabled] {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                    border-color: transparent;
                }
            `
        )
    );

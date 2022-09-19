import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../../utilities/style/focus';
import {
    actionRgbPartialColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    buttonLabelFont,
    buttonLabelFontColor,
    buttonLabelDisabledFontColor,
    controlHeight,
    fillSelectedColor,
    iconColor,
    smallDelay,
    standardPadding
} from '../../theme-provider/design-tokens';
import { appearanceBehavior } from '../../utilities/style/appearance';
import { ButtonAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        background-color: transparent;
        height: ${controlHeight};
        color: ${buttonLabelFontColor};
        font: ${buttonLabelFont};
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
        color: ${buttonLabelDisabledFontColor};
        cursor: default;
    }

    .control {
        background-color: transparent;
        height: 100%;
        width: 100%;
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
        font: inherit;
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
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        outline: none;
    }

    .control${focusVisible} {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        outline: ${borderWidth} solid ${borderHoverColor};
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
        ${
            /**
             * Hide content visually while keeping it screen reader-accessible.
             * Source: https://webaim.org/techniques/css/invisiblecontent/#techniques
             * See discussion here: https://github.com/microsoft/fast/issues/5740#issuecomment-1068195035
             */
            ''
        }
        display: inline-block;
        height: 1px;
        width: 1px;
        position: absolute;
        margin: -1px;
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(50%);
        overflow: hidden;
        padding: 0;
    }

    [part='start'] {
        display: contents;
        ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
    }

    :host([disabled]) slot[name='start']::slotted(*) {
        opacity: 0.3;
    }

    [part='end'] {
        display: contents;
        ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
    }

    :host([disabled]) slot[name='end']::slotted(*) {
        opacity: 0.3;
    }

    :host([content-hidden]) [part='end'] {
        display: none;
    }
`.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            .control {
                background-color: transparent;
                border-color: rgba(${actionRgbPartialColor}, 0.3);
            }

            .control:hover {
                background-color: transparent;
                border-color: ${borderHoverColor};
            }

            .control${focusVisible} {
                background-color: transparent;
                border-color: ${borderHoverColor};
            }

            .control:active {
                background-color: ${fillSelectedColor};
                border-color: ${fillSelectedColor};
            }

            .control[disabled] {
                background-color: transparent;
                border-color: rgba(${borderRgbPartialColor}, 0.2);
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.ghost,
        css`
            .control {
                background-color: transparent;
                border-color: transparent;
            }

            .control:hover {
                background-color: transparent;
                border-color: ${borderHoverColor};
            }

            .control${focusVisible} {
                background-color: transparent;
                border-color: ${borderHoverColor};
            }

            .control:active {
                background-color: ${fillSelectedColor};
                border-color: ${fillSelectedColor};
            }

            .control[disabled] {
                background-color: transparent;
                border-color: transparent;
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
            }

            .control:hover {
                background-color: transparent;
                border-color: ${borderHoverColor};
            }

            .control${focusVisible} {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: ${borderHoverColor};
            }

            .control${focusVisible}:hover {
                background-color: transparent;
            }

            .control:active {
                background-color: ${fillSelectedColor};
                border-color: ${fillSelectedColor};
            }

            .control[disabled] {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
            }
        `
    )
);

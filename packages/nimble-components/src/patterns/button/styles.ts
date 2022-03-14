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
             * Source: https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html
             */
            ''
        }
        display: inline-block;
        height: 1px;
        width: 1px;
        position: absolute;
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        overflow: hidden;
        white-space: nowrap;
    }

    [part='start'] {
        display: contents;
    }

    slot[name='start']::slotted(*) {
        ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
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
            ButtonAppearance.Ghost,
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
            ButtonAppearance.Block,
            css`
                .control {
                    background-color: rgba(${borderRgbPartialColor}, 0.1);
                    border-color: transparent;
                }

                .control:hover {
                    background-color: rgba(${borderRgbPartialColor}, 0.1);
                    border-color: ${borderHoverColor};
                }

                .control${focusVisible} {
                    background-color: rgba(${borderRgbPartialColor}, 0.1);
                    border-color: ${borderHoverColor};
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

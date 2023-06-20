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
    standardPadding,
    applicationBackgroundColor
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
        border: 0px solid transparent;
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
        aspect-ratio: 1 / 1;
        padding: 0px;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    .control:hover {
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset,
            0px 0px 0px 3px ${applicationBackgroundColor} inset;
        outline: none;
    }

    .control${focusVisible} {
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset,
            0px 0px 0px 3px ${applicationBackgroundColor} inset,
            0px 0px 0px 4px ${borderHoverColor} inset;
    }

    .control:active {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset,
            0px 0px 0px 2px ${applicationBackgroundColor} inset;
        outline: none;
    }

    :host([disabled]) .control {
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
                box-shadow: 0px 0px 0px ${borderWidth}
                    rgba(${actionRgbPartialColor}, 0.3) inset;
            }

            .control:active {
                background-color: ${fillSelectedColor};
            }

            :host([disabled]) .control {
                background-color: transparent;
                box-shadow: 0px 0px 0px ${borderWidth}
                    rgba(${actionRgbPartialColor}, 0.3) inset;
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.ghost,
        css`
            .control:active {
                background-color: ${fillSelectedColor};
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .control${focusVisible} {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .control:active {
                background-color: ${fillSelectedColor};
            }

            :host([disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }
        `
    )
);

export const buttonAppearanceVariantStyles = css``.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            :host([appearance-variant='primary']) .control {
                box-shadow: 0px 0px 0px calc(2 * ${borderWidth})
                    rgba(${actionRgbPartialColor}, 0.3) inset;
            }

            :host([appearance-variant='primary']) .control:hover {
                box-shadow: 0px 0px 0px calc(2 * ${borderWidth})
                    ${borderHoverColor} inset;
            }

            :host([appearance-variant='primary']) .control${focusVisible} {
                box-shadow: 0px 0px 0px calc(2 * ${borderWidth})
                        ${borderHoverColor} inset,
                    0px 0px 0px 3px ${applicationBackgroundColor} inset,
                    0px 0px 0px 4px ${borderHoverColor} inset;
            }

            :host([appearance-variant='primary']) .control:active {
                box-shadow: 0px 0px 0px ${borderWidth} ${fillSelectedColor}
                    inset;
            }

            :host([appearance-variant='primary'][disabled]) .control {
                box-shadow: none;
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            :host([appearance-variant='primary']) .control {
                background-clip: padding-box;
                border-color: rgba(${actionRgbPartialColor}, 0.3);
                border-width: calc(2 * ${borderWidth});
                padding: 0 calc(${standardPadding} - ${borderWidth});
            }

            :host([appearance-variant='primary'][content-hidden]) .control {
                padding: 0px;
            }

            :host([appearance-variant='primary']) .control:hover {
                border-color: ${borderHoverColor};
                box-shadow: none;
            }

            :host([appearance-variant='primary']) .control${focusVisible} {
                background-clip: border-box;
                border-color: ${borderHoverColor};
                border-width: ${borderWidth};
                box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
                padding: 0 ${standardPadding};
            }

            :host([appearance-variant='primary'][content-hidden])
                .control${focusVisible} {
                padding: 0px;
            }

            :host([appearance-variant='primary']) .control:active {
                background-clip: border-box;
                border-color: ${fillSelectedColor};
                border-width: ${borderWidth};
                box-shadow: none;
                padding: 0 ${standardPadding};
            }

            :host([appearance-variant='primary'][content-hidden])
                .control:active {
                padding: 0px;
            }

            :host([appearance-variant='primary'][disabled]) .control {
                background-clip: border-box;
                border-color: transparent;
                border-width: ${borderWidth};
                box-shadow: none;
                padding: 0 ${standardPadding};
            }

            :host([appearance-variant='primary'][disabled][content-hidden])
                .control {
                padding: 0px;
            }
        `
    )
);

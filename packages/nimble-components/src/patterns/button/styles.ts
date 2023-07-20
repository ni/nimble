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
    buttonPrimaryFontColor,
    buttonFillPrimaryColor,
    buttonFillPrimaryActiveColor,
    buttonFillAccentColor,
    buttonAccentBlockFontColor,
    buttonFillAccentActiveColor,
    buttonBorderAccentOutlineColor,
    buttonAccentOutlineFontColor
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
        position: relative;
        transition: box-shadow ${smallDelay} ease-in-out,
            border-color ${smallDelay} ease-in-out,
            background-size ${smallDelay} ease-in-out;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
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
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    .control${focusVisible} {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    .control:active {
        box-shadow: none;
        background-image: linear-gradient(
            ${fillSelectedColor},
            ${fillSelectedColor}
        );
        background-size: calc(100% - 2px) calc(100% - 2px);
    }

    :host([disabled]) .control {
        box-shadow: none;
        background-image: none;
    }

    .control::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        box-sizing: border-box;
        outline: 0px solid transparent;
        color: transparent;
        background-clip: content-box;
        transition: outline ${smallDelay} ease-in-out;
    }

    .control${focusVisible}::before {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -3px;
    }

    .control:active::before {
        outline: none;
    }

    :host([disabled]) .control::before {
        box-shadow: none;
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
                border-color: rgba(${actionRgbPartialColor}, 0.3);
            }

            .control:hover {
                background-color: transparent;
            }

            :host([disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.3);
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.ghost,
        css`
            .control:hover {
                background-color: transparent;
            }

            .control${focusVisible} {
                background-color: transparent;
            }

            :host([disabled]) .control {
                border-color: transparent;
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .control:hover {
                background-color: transparent;
                background-image: linear-gradient(
                    rgba(${borderRgbPartialColor}, 0.1),
                    rgba(${borderRgbPartialColor}, 0.1)
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            .control${focusVisible} {
                background-color: transparent;
                background-image: linear-gradient(
                    rgba(${borderRgbPartialColor}, 0.1),
                    rgba(${borderRgbPartialColor}, 0.1)
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            .control:active {
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                background-size: calc(100% - 2px) calc(100% - 2px);
            }

            :host([disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
            }
        `
    )
);

export const buttonAppearanceVariantStyles = css``.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            :host([appearance-variant='primary']) .control {
                border-color: ${actionRgbPartialColor};
            }

            :host([appearance-variant='primary']) .control:hover {
                border-color: ${borderHoverColor};
                background-color: transparent;
            }

            :host([appearance-variant='primary']) .control${focusVisible} {
                border-color: ${borderHoverColor};
            }

            :host([appearance-variant='primary']) .control:active {
                outline: none;
            }

            :host([appearance-variant='primary'][disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.3);
            }

            :host([appearance-variant='accent']) .control {
                border-color: ${buttonBorderAccentOutlineColor};
                color: ${buttonAccentOutlineFontColor};
            }

            :host([appearance-variant='accent']) .control:hover {
                background-color: transparent;
            }

            :host([appearance-variant='accent']) .control:active {
                outline: none;
            }

            :host([appearance-variant='accent'][disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.3);
                color: rgba(${actionRgbPartialColor}, 0.3);
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            :host([appearance-variant='primary']) [part='start'] {
                ${iconColor.cssCustomProperty}: white;
            }

            :host([appearance-variant='primary'][disabled]) slot[name='start'] {
                ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
            }

            :host([appearance-variant='primary']) .control {
                background-color: ${buttonFillPrimaryColor};
                color: ${buttonPrimaryFontColor};
            }

            :host([appearance-variant='primary']) .control:hover {
                background-color: transparent;
                background-image: linear-gradient(
                    ${buttonFillPrimaryColor},
                    ${buttonFillPrimaryColor}
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
                color: ${buttonPrimaryFontColor};
            }

            :host([appearance-variant='primary']) .control${focusVisible} {
                background-color: transparent;
                background-image: linear-gradient(
                    ${buttonFillPrimaryColor},
                    ${buttonFillPrimaryColor}
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            :host([appearance-variant='primary']) .control:active {
                background-image: linear-gradient(
                    ${buttonFillPrimaryActiveColor},
                    ${buttonFillPrimaryActiveColor}
                );
                background-size: calc(100% - 2px) calc(100% - 2px);
            }

            :host([appearance-variant='primary'][disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
                color: rgba(${actionRgbPartialColor}, 0.3);
                background-image: none;
            }

            :host([appearance-variant='primary']) [part='end'] {
                ${iconColor.cssCustomProperty}: white;
            }

            :host([appearance-variant='primary'][disabled]) slot[name='end'] {
                ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
            }

            :host([appearance-variant='accent']) [part='start'] {
                ${iconColor.cssCustomProperty}: white;
            }

            :host([appearance-variant='accent'][disabled]) slot[name='start'] {
                ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
            }

            :host([appearance-variant='accent']) .control {
                background-color: ${buttonFillAccentColor};
                color: ${buttonAccentBlockFontColor};
            }

            :host([appearance-variant='accent']) .control:hover {
                background-color: transparent;
                background-image: linear-gradient(
                    ${buttonFillAccentColor},
                    ${buttonFillAccentColor}
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
                color: ${buttonAccentBlockFontColor};
            }

            :host([appearance-variant='accent']) .control${focusVisible} {
                background-color: transparent;
                background-image: linear-gradient(
                    ${buttonFillAccentColor},
                    ${buttonFillAccentColor}
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            :host([appearance-variant='accent']) .control:active {
                background-image: linear-gradient(
                    ${buttonFillAccentActiveColor},
                    ${buttonFillAccentActiveColor}
                );
                background-size: calc(100% - 2px) calc(100% - 2px);
            }

            :host([appearance-variant='accent'][disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
                color: rgba(${actionRgbPartialColor}, 0.3);
                background-image: none;
            }

            :host([appearance-variant='accent']) [part='end'] {
                ${iconColor.cssCustomProperty}: white;
            }

            :host([appearance-variant='accent'][disabled]) slot[name='end'] {
                ${iconColor.cssCustomProperty}: ${buttonLabelFontColor}
            }
        `
    )
);

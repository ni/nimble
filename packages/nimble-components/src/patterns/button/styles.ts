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
    primaryButtonBackgroundColor,
    primaryButtonFontColor,
    primaryFillActionColor,
    accentButtonBackgroundColor,
    accentFillActionColor,
    accentButtonBlockFontColor,
    accentButtonOutlineFontColor,
    accentButtonOutlineBorderColor,
    mediumDelay,
} from '../../theme-provider/design-tokens';
import {
    appearanceBehavior,
    appearanceVariantBehavior
} from '../../utilities/style/appearance';
import { ButtonAppearance, ButtonAppearanceVariant } from './types';

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
        outline: transparent;
        margin: 0;
        padding: 0 ${standardPadding};
        position: relative;
        transition: box-shadow ${smallDelay};
        transition: border-color ${smallDelay};
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
        transition: box-shadow ${mediumDelay};
    }

    .control${focusVisible} {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    .control:active {
        box-shadow: none;
        outline: none;
        transition: outline ${mediumDelay};
        transition: box-shadow ${mediumDelay};
    }

    :host([disabled]) .control {
        box-shadow: none;
        outline: none;
    }

    .control::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        box-sizing: border-box;
        outline: none;
        background-clip: content-box;
        z-index: -1;
    }

    .control:hover::before {
        transition: padding ${mediumDelay};
    }

    .control${focusVisible}::before {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -3px;
        transition: outline 0.5s;
        color: transparent;
    }

    .control:active::before {
        outline: none;
        transition: padding ${mediumDelay};
    }

    :host([disabled]) .control::before {
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
                border-color: rgba(${actionRgbPartialColor}, 0.3);
            }

            .control:hover {
                background-color: transparent;
            }

            .control${focusVisible} {
                background-color: transparent;
            }

            .control:active {
                outline: none;
            }

            :host([disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.3);
            }

            .control:active::before {
                background-color: ${fillSelectedColor};
                outline: none;
                padding: ${borderWidth};
            }

            :host([disabled]) .control::before {
                background-color: transparent;
                border-color: rgba(${borderRgbPartialColor}, 0.1);
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

            .control:active::before {
                background-color: ${fillSelectedColor};
                outline: none;
                padding: ${borderWidth};
            }

            :host([disabled]) .control::before {
                background-color: transparent;
                border-color: rgba(${borderRgbPartialColor}, 0.1);
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
            }

            .control${focusVisible} {
                background-color: transparent;
            }

            :host([disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
            }

            .control:hover::before {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                padding: 2px;
            }

            .control${focusVisible}::before {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                padding: 2px;
            }

            .control:active::before {
                background-color: ${fillSelectedColor};
                padding: ${borderWidth};
                outline: none;
            }

            :host([disabled]) .control::before {
                background-color: transparent;
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }
        `
    )
);

export const buttonAppearanceVariantStyles = css``.withBehaviors(
    // appearanceBehavior(
    //     ButtonAppearance.outline,
    //     css`
    //         :host([appearance-variant='primary']) .control {
    //             box-shadow: 0px 0px 0px ${borderWidth}
    //                 rgba(${actionRgbPartialColor}, 0.3) inset;
    //         }

    //         :host([appearance-variant='primary']) .control:hover {
    //             box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    //         }

    //         :host([appearance-variant='primary']) .control${focusVisible} {
    //             box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    //         }

    //         :host([appearance-variant='primary']) .control:active {
    //             box-shadow: none;
    //         }

    //         :host([appearance-variant='primary'][disabled]) .control {
    //             box-shadow: none;
    //         }
    //     `
    // ),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    appearanceVariantBehavior(
        ButtonAppearanceVariant.primary,
        css``.withBehaviors(
            appearanceBehavior(
                ButtonAppearance.block,
                css`
                    .control {
                        background-color: ${primaryButtonBackgroundColor};
                        color: ${primaryButtonFontColor};
                    }

                    .control:hover {
                        background-color: transparent;
                    }

                    .control${focusVisible} {
                        background-color: transparent;
                    }

                    :host([disabled]) .control {
                        background-color: rgba(${borderRgbPartialColor}, 0.1);
                        border-color: transparent;
                        color: rgba(${actionRgbPartialColor}, 0.3);
                    }

                    .control:hover::before {
                        background-color: ${primaryButtonBackgroundColor};
                        padding: 2px;
                    }

                    .control${focusVisible}::before {
                        background-color: ${primaryButtonBackgroundColor};
                        padding: 2px;
                    }

                    .control:active::before {
                        background-color: ${primaryFillActionColor};
                        padding: ${borderWidth};
                        outline: none;
                    }

                    :host([disabled]) .control::before {
                        background-color: transparent;
                        border-color: rgba(${borderRgbPartialColor}, 0.1);
                    }
                `
            ),
            appearanceBehavior(
                ButtonAppearance.outline,
                css`
                    .control {
                        border-color: ${actionRgbPartialColor};
                    }

                    .control:hover {
                        background-color: transparent;
                    }

                    .control${focusVisible} {
                        background-color: transparent;
                    }

                    .control:active {
                        outline: none;
                    }

                    :host([disabled]) .control {
                        border-color: rgba(${borderRgbPartialColor}, 0.3);
                    }

                    .control:active::before {
                        background-color: ${fillSelectedColor};
                        outline: none;
                        padding: ${borderWidth};
                    }

                    :host([disabled]) .control::before {
                        background-color: transparent;
                        border-color: rgba(${borderRgbPartialColor}, 0.1);
                    }
                `
            )
        )
    ),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    appearanceVariantBehavior(
        ButtonAppearanceVariant.primaryAccent,
        css``.withBehaviors(
            appearanceBehavior(
                ButtonAppearance.block,
                css`
                    .control {
                        background-color: ${accentButtonBackgroundColor};
                        color: ${accentButtonBlockFontColor};
                    }

                    .control:hover {
                        background-color: transparent;
                    }

                    .control${focusVisible} {
                        background-color: transparent;
                    }

                    :host([disabled]) .control {
                        background-color: rgba(${borderRgbPartialColor}, 0.1);
                        color: rgba(${actionRgbPartialColor}, 0.3);
                        border-color: transparent;
                    }

                    .control:hover::before {
                        background-color: ${accentButtonBackgroundColor};
                        padding: 2px;
                    }

                    .control${focusVisible}::before {
                        background-color: ${accentButtonBackgroundColor};
                        padding: 2px;
                    }

                    .control:active::before {
                        background-color: ${accentFillActionColor};
                        padding: ${borderWidth};
                        outline: none;
                    }

                    :host([disabled]) .control::before {
                        background-color: transparent;
                        border-color: rgba(${borderRgbPartialColor}, 0.1);
                    }
                `
            ),
            appearanceBehavior(
                ButtonAppearance.outline,
                css`
                    .control {
                        border-color: ${accentButtonOutlineBorderColor};
                        color: ${accentButtonOutlineFontColor};
                    }

                    .control:hover {
                        background-color: transparent;
                    }

                    .control${focusVisible} {
                        background-color: transparent;
                    }

                    .control:active {
                        outline: none;
                    }

                    :host([disabled]) .control {
                        border-color: rgba(${borderRgbPartialColor}, 0.3);
                        color: rgba(${actionRgbPartialColor}, 0.3);
                    }

                    .control:active::before {
                        background-color: ${fillSelectedColor};
                        outline: none;
                        padding: ${borderWidth};
                    }

                    :host([disabled]) .control::before {
                        background-color: transparent;
                        border-color: rgba(${borderRgbPartialColor}, 0.1);
                    }
                `
            )
        )
    )
    // appearanceBehavior(
    //     ButtonAppearance.block,
    //     css`
    //         :host([appearance-variant="primary"]) .control {
    //             background-clip: padding-box;
    //             background-color: rgba(${actionRgbPartialColor}, 0.75);
    //             border-color: rgba(${actionRgbPartialColor}, 0.75);
    //             padding: 0 ${standardPadding};
    //             color: white;
    //         }

    //         :host([appearance-variant='primary'][content-hidden]) .control {
    //             padding: 0px;
    //         }

    //         :host([appearance-variant='primary']) .control:hover {
    //             border-color: ${borderHoverColor};
    //             background-color: rgba(${actionRgbPartialColor}, 0.75);
    //             box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    //             outline: none;
    //         }

    //         :host([appearance-variant='primary']) .control${focusVisible} {
    //             background-clip: border-box;
    //             border-color: ${borderHoverColor};
    //             border-width: ${borderWidth};
    //             box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    //             padding: 0 ${standardPadding};
    //         }

    //         :host([appearance-variant='primary'][content-hidden])
    //             .control${focusVisible} {
    //             padding: 0px;
    //         }

    //         :host([appearance-variant='primary']) .control:active {
    //             background-clip: border-box;
    //             border-color: ${fillSelectedColor};
    //             border-width: ${borderWidth};
    //             box-shadow: none;
    //             padding: 0 ${standardPadding};
    //             background-color: rgba(${actionRgbPartialColor}, 0.85);
    //         }

    //         :host([appearance-variant='primary'][content-hidden])
    //             .control:active {
    //             padding: 0px;
    //         }

    //         :host([appearance-variant='primary'][disabled]) .control {
    //             background-clip: border-box;
    //             border-color: transparent;
    //             border-width: ${borderWidth};
    //             box-shadow: none;
    //             padding: 0 ${standardPadding};
    //         }

    //         :host([appearance-variant='primary'][disabled][content-hidden])
    //             .control {
    //             padding: 0px;
    //         }
    //     `
    // )
);

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
    buttonFillActivePrimaryColor,
    buttonFillAccentColor,
    buttonAccentBlockFontColor,
    buttonFillAccentActiveColor,
    buttonBorderAccentOutlineColor,
    buttonAccentOutlineFontColor
} from '../../theme-provider/design-tokens';
import { appearanceBehavior } from '../../utilities/style/appearance';
import { ButtonAppearance } from './types';
import { accessiblyHidden } from '../../utilities/style/accessibly-hidden';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
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
                    For additional discussion, see: https://github.com/ni/nimble/issues/503
                */ ''
            }
            vertical-align: middle;
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

        .content {
            display: contents;
        }

        :host([content-hidden]) .content {
            ${accessiblyHidden}
        }

        [part='start'] {
            display: contents;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }

        [part='end'] {
            display: contents;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }
    }

    @layer hover {
        .control:hover {
            border-color: ${borderHoverColor};
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        }
    }

    @layer focusVisible {
        .control${focusVisible} {
            border-color: ${borderHoverColor};
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        }

        .control${focusVisible}::before {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -3px;
        }
    }

    @layer active {
        .control:active {
            box-shadow: none;
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            background-size: calc(100% - 2px) calc(100% - 2px);
        }

        .control:active::before {
            outline: none;
        }
    }

    @layer disabled {
        :host([disabled]) {
            color: ${buttonLabelDisabledFontColor};
            cursor: default;
        }

        :host([disabled]) .control {
            box-shadow: none;
            background-image: none;
            color: rgba(${actionRgbPartialColor}, 0.3);
        }

        :host([disabled]) .control::before {
            box-shadow: none;
        }

        :host([disabled]) slot[name='start']::slotted(*) {
            opacity: 0.3;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }

        :host([disabled]) slot[name='end']::slotted(*) {
            opacity: 0.3;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }
    }

    @layer top {
        @media (prefers-reduced-motion) {
            .control {
                transition-duration: 0s;
            }
        }

        :host([content-hidden]) [part='end'] {
            display: none;
        }
    }
`.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            @layer base {
                .control {
                    border-color: rgba(${actionRgbPartialColor}, 0.3);
                }
            }

            @layer disabled {
                :host([disabled]) .control {
                    border-color: rgba(${borderRgbPartialColor}, 0.3);
                }
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.ghost,
        css`
            @layer disabled {
                :host([disabled]) .control {
                    border-color: transparent;
                }
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            @layer base {
                .control {
                    background-image: linear-gradient(
                        rgba(${borderRgbPartialColor}, 0.1),
                        rgba(${borderRgbPartialColor}, 0.1)
                    );
                    border-color: rgba(${borderRgbPartialColor}, 0.1);
                }
            }

            @layer hover {
                .control:hover {
                    background-size: calc(100% - 4px) calc(100% - 4px);
                }
            }

            @layer focusVisible {
                .control${focusVisible} {
                    background-size: calc(100% - 4px) calc(100% - 4px);
                }
            }

            @layer disabled {
                :host([disabled]) .control {
                    background-image: linear-gradient(
                        rgba(${borderRgbPartialColor}, 0.1),
                        rgba(${borderRgbPartialColor}, 0.1)
                    );
                    background-size: 100% 100%;
                    border-color: rgba(${borderRgbPartialColor}, 0.1);
                }
            }
        `
    )
);

export const buttonAppearanceVariantStyles = css``.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            @layer base {
                :host([appearance-variant='primary']) .control {
                    border-color: ${actionRgbPartialColor};
                }

                :host([appearance-variant='accent']) .control {
                    border-color: ${buttonBorderAccentOutlineColor};
                    color: ${buttonAccentOutlineFontColor};
                }
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            @layer base {
                :host([appearance-variant='primary']) [part='start'] {
                    ${iconColor.cssCustomProperty}: white;
                }

                :host([appearance-variant='primary']) .control {
                    background-image: linear-gradient(
                        ${buttonFillPrimaryColor},
                        ${buttonFillPrimaryColor}
                    );
                    color: ${buttonPrimaryFontColor};
                    border-color: ${buttonFillPrimaryColor};
                }

                :host([appearance-variant='primary']) [part='end'] {
                    ${iconColor.cssCustomProperty}: white;
                }

                :host([appearance-variant='accent']) [part='start'] {
                    ${iconColor.cssCustomProperty}: white;
                }

                :host([appearance-variant='accent']) .control {
                    background-image: linear-gradient(
                        ${buttonFillAccentColor},
                        ${buttonFillAccentColor}
                    );
                    color: ${buttonAccentBlockFontColor};
                    border-color: ${buttonFillAccentColor};
                }

                :host([appearance-variant='accent']) [part='end'] {
                    ${iconColor.cssCustomProperty}: white;
                }
            }

            @layer active {
                :host([appearance-variant='primary']) .control:active {
                    background-image: linear-gradient(
                        ${buttonFillActivePrimaryColor},
                        ${buttonFillActivePrimaryColor}
                    );
                }

                :host([appearance-variant='accent']) .control:active {
                    background-image: linear-gradient(
                        ${buttonFillAccentActiveColor},
                        ${buttonFillAccentActiveColor}
                    );
                }
            }
        `
    )
);

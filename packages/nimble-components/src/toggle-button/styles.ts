import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    borderHoverColor,
    borderWidth,
    buttonAccentOutlineFontColor,
    buttonLabelFontColor,
    fillSelectedColor,
    fillSelectedRgbPartialColor,
    iconColor
} from '../theme-provider/design-tokens';
import {
    buttonAppearanceVariantStyles,
    styles as buttonStyles
} from '../patterns/button/styles';
import { appearanceBehavior } from '../utilities/style/appearance';
import { ButtonAppearance } from './types';

export const styles = css`
    ${buttonStyles}
    ${buttonAppearanceVariantStyles}

    @layer pressed {
        @layer base {
            .control[aria-pressed='true'] {
                background-color: transparent;
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                border-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
            }
        }

        @layer hover {
            .control[aria-pressed='true']:hover {
                border-color: ${borderHoverColor};
                box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }
        }

        @layer focusVisible {
            .control[aria-pressed='true']${focusVisible} {
                border-color: ${borderHoverColor};
                box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            .control[aria-pressed='true']${focusVisible}::before {
                outline: ${borderWidth} solid ${borderHoverColor};
                outline-offset: -3px;
                color: transparent;
            }
        }

        @layer active {
            .control[aria-pressed='true']:active {
                box-shadow: none;
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                background-size: calc(100% - 2px) calc(100% - 2px);
                border-color: ${borderHoverColor};
            }

            .control[aria-pressed='true']:active::before {
                outline: none;
            }
        }

        @layer disabled {
            :host([disabled]) .control[aria-pressed='true'] {
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                border-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
            }

            :host([disabled]) .control[aria-pressed='true']:hover {
                background-image: linear-gradient(
                    ${fillSelectedColor},
                    ${fillSelectedColor}
                );
                background-size: 100% 100%;
                border-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
                box-shadow: none;
            }
        }
    }
`.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            @layer active {
                :host([appearance-variant='accent'])
                    .control:active
                    [part='start'],
                :host([appearance-variant='accent'])
                    .control:active
                    [part='end'] {
                    ${iconColor.cssCustomProperty}: ${buttonAccentOutlineFontColor};
                }

                :host([appearance-variant='accent']) .control:active {
                    color: ${buttonAccentOutlineFontColor};
                }
            }
        `
    ),
    appearanceBehavior(
        ButtonAppearance.block,
        css`
            @layer pressed.base {
                .control[aria-pressed='true'] [part='start'],
                .control[aria-pressed='true'] [part='end'] {
                    ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
                }

                .control[aria-pressed='true'] {
                    color: ${buttonLabelFontColor};
                }
            }

            @layer active {
                :host([appearance-variant='primary']) .control:active,
                :host([appearance-variant='accent']) .control:active {
                    color: ${buttonLabelFontColor};
                    border-color: ${borderHoverColor};
                    background-image: linear-gradient(
                        ${fillSelectedColor},
                        ${fillSelectedColor}
                    );
                }
            }
        `
    )
);

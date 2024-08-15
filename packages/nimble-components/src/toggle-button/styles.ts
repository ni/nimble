import { css } from '@microsoft/fast-element';

import {
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

    @layer checked {
        .control[aria-pressed='true'] {
            background-color: transparent;
            color: ${buttonLabelFontColor};
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            border-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
        }

        .control[aria-pressed='true'] [part='start'],
        .control[aria-pressed='true'] [part='end'] {
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
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
    }
`.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            @layer checked {
                :host([appearance-variant='accent'])
                    .control[aria-pressed='true'] {
                    color: ${buttonAccentOutlineFontColor};
                }

                :host([appearance-variant='accent'])
                    .control[aria-pressed='true']
                    [part='start'],
                :host([appearance-variant='accent'])
                    .control[aria-pressed='true']
                    [part='end'] {
                    ${iconColor.cssCustomProperty}: ${buttonAccentOutlineFontColor};
                }
            }
        `
    )
);

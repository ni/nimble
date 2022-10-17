import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    actionRgbPartialColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';
import { appearanceBehavior } from '../utilities/style/appearance';
import { ButtonAppearance } from './types';

export const styles = buttonStyles.withBehaviors(
    appearanceBehavior(
        ButtonAppearance.outline,
        css`
            :host([appearance-variant='primary']) .control {
                box-shadow: 0px 0px 0px ${borderWidth}
                    rgba(${actionRgbPartialColor}, 0.3) inset;
            }

            :host([appearance-variant='primary']) .control:hover {
                box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
            }

            :host([appearance-variant='primary']) .control${focusVisible} {
                box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
            }

            :host([appearance-variant='primary']) .control:active {
                box-shadow: none;
            }

            :host([appearance-variant='primary']) .control[disabled] {
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

            :host([appearance-variant='primary']) .control[disabled] {
                background-clip: border-box;
                border-color: transparent;
                border-width: ${borderWidth};
                box-shadow: none;
                padding: 0 ${standardPadding};
            }

            :host([appearance-variant='primary'][content-hidden])
                .control[disabled] {
                padding: 0px;
            }
        `
    )
);

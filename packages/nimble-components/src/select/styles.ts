import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from '../patterns/dropdown/types';
import {
    borderWidth,
    borderRgbPartialColor,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${dropdownStyles}
`.withBehaviors(
        appearanceBehavior(
            DropdownAppearance.underline,
            css`
            .control {
                padding-top: ${borderWidth};
                padding-left: calc(${borderWidth} + ${standardPadding} / 2);
                padding-right: ${borderWidth};
            }

            :host([disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }
        `
        ),
        appearanceBehavior(
            DropdownAppearance.outline,
            css`
            .control {
                border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
            }
        `
        ),
        appearanceBehavior(
            DropdownAppearance.block,
            css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                padding-left: calc(${borderWidth} + ${standardPadding} / 2);
                padding-right: ${borderWidth};
                padding-bottom: calc(${borderWidth});
                border-bottom: ${borderWidth}
                    rgba(${borderRgbPartialColor}, 0.07);
            }

            :host([disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }
        `
        )
    );

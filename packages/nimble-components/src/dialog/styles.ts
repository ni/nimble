import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { Black } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

import {
    applicationBackgroundColor,
    borderWidth,
    popupBoxShadowColor,
    popupBorderColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('grid')}

    dialog {
        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: 0px 2px 3px ${popupBoxShadowColor};
        max-width: 50%;
    }
`.withBehaviors(
    /*
     * These colors/opacities for the backdrop should be the same as modalBackdropColor.
     * We cannot use that token directly because the backdrop element is not a descendant
     * of the nimble-theme-provider element.
     */
        themeBehavior(
            Theme.light,
            css`
            dialog::backdrop {
                background: ${hexToRgbaCssColor(Black, 0.3)};
            }
        `
        ),
        themeBehavior(
            Theme.dark,
            css`
            dialog::backdrop {
                background: ${hexToRgbaCssColor(Black, 0.6)};
            }
        `
        ),
        themeBehavior(
            Theme.color,
            css`
            dialog::backdrop {
                background: ${hexToRgbaCssColor(Black, 0.6)};
            }
        `
        )
    );

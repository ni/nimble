import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    borderWidth,
    popupBoxShadowColor,
    popupBorderColor
} from '../theme-provider/design-tokens';
import {
    modalBackdropColorThemeColor,
    modalBackdropColorThemeDark,
    modalBackdropColorThemeLight
} from '../theme-provider/design-tokens-static';
import { Theme } from '../theme-provider/types';
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
     * We cannot use the modalBackdropColor token directly because the backdrop
     * element is not a descendant of the nimble-theme-provider element.
     */
        themeBehavior(
            Theme.light,
            css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeLight};
            }
        `
        ),
        themeBehavior(
            Theme.dark,
            css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeDark};
            }
        `
        ),
        themeBehavior(
            Theme.color,
            css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeColor};
            }
        `
        )
    );

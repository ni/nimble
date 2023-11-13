import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    standardPadding,
    actionRgbPartialColor,
    bodyFont,
    bodyFontColor,
    titlePlus1Font,
    titlePlus1FontColor,
    smallPadding,
    subtitleFont,
    subtitleFontColor,
    elevation3BoxShadow,
    dialogSmallWidth,
    dialogSmallHeight,
    dialogSmallMaxHeight
} from '../theme-provider/design-tokens';
import {
    modalBackdropColorThemeColorStatic,
    modalBackdropColorThemeDarkStatic,
    modalBackdropColorThemeLightStatic
} from '../theme-provider/design-tokens-static';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';
import { accessiblyHidden } from '../utilities/style/accessibly-hidden';

export const styles = css`
    ${display('grid')}

    dialog {
        flex-direction: column;
        background-color: ${applicationBackgroundColor};
        border: none;
        box-shadow: ${elevation3BoxShadow};
        padding: 0px;
        width: ${dialogSmallWidth};
        height: ${dialogSmallHeight};
        max-height: ${dialogSmallMaxHeight};
    }

    dialog[open] {
        display: flex;
    }

    header {
        min-height: 48px;
        padding: 24px 24px 0px 24px;
        flex: none;
        display: flex;
        flex-direction: column;
        gap: ${smallPadding};
    }

    :host([header-hidden]) header {
        ${accessiblyHidden}
    }

    .title {
        font: ${titlePlus1Font};
        color: ${titlePlus1FontColor};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .subtitle {
        font: ${subtitleFont};
        color: ${subtitleFontColor};
    }

    section {
        flex: auto;
        overflow-y: auto;
        font: ${bodyFont};
        color: ${bodyFontColor};
        display: flex;
        flex-direction: column;
        gap: ${standardPadding};

        ${
            /**
             * Use padding on all sides except the top because the padding is within
             * the scrollable area. The whole scrollable area, including the top of
             * the scrollbar, should be 24px away from the header, so use a margin
             * instead of padding for the top.
             */
            ''
        }
        padding: 0px 24px 24px 24px;
        margin-top: 24px;
    }

    footer {
        border-top: 2px solid rgba(${actionRgbPartialColor}, 0.1);
        padding: 24px;
        flex: none;
        display: flex;
        justify-content: flex-end;
        gap: ${standardPadding};
    }

    footer.empty {
        padding: 0px;
        height: 72px;
        border-top: none;
    }

    :host([footer-hidden]) footer {
        display: none;
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
                background: ${modalBackdropColorThemeLightStatic};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeDarkStatic};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeColorStatic};
            }
        `
    )
);

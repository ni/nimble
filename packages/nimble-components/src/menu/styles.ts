import { css } from '@microsoft/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '../utilities/style/display';

import {
    applicationBackgroundColor,
    borderWidth,
    borderColor,
    popupBorderColor,
    groupHeaderFont,
    groupHeaderTextTransform,
    groupHeaderFontColor,
    smallPadding,
    mediumPadding,
    elevation2BoxShadow,
    menuMinWidth
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';
import { anchorMenuItemTag } from '../anchor-menu-item';

export const styles = css`
    ${display('grid')}

    :host {
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        min-width: ${menuMinWidth};
        width: max-content;
        box-shadow: ${elevation2BoxShadow};
    }

    slot {
        padding: 4px;
        display: block;
    }

    :host([slot='submenu']) {
        margin: 0 ${mediumPadding};
        cursor: default;
    }

    ::slotted(*) {
        padding-left: 8px;
        padding-right: 8px;
    }

    ::slotted(hr) {
        box-sizing: content-box;
        height: 2px;
        margin: ${smallPadding};
        border: none;
        background: ${borderColor};
        opacity: 0.1;
    }

    ::slotted(header) {
        display: flex;
        font: ${groupHeaderFont};
        color: ${groupHeaderFontColor};
        text-transform: ${groupHeaderTextTransform};
        padding-top: ${smallPadding};
        padding-bottom: ${smallPadding};
    }

    ::slotted(${anchorMenuItemTag}) {
        padding: 0px;
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            slot {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);

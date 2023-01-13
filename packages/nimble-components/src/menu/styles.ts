import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

import {
    applicationBackgroundColor,
    borderWidth,
    borderColor,
    popupBorderColor,
    groupHeaderFont,
    groupHeaderTextTransform,
    groupHeaderFontColor,
    smallPadding,
    elevation2BoxShadow
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('grid')}

    :host {
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        padding: 4px;
        min-width: 168px;
        width: max-content;
        box-shadow: ${elevation2BoxShadow};
        position: relative;
    }

    :host([slot='submenu']) {
        margin: 0 calc(${smallPadding} * 2);
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
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            :host::before {
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);

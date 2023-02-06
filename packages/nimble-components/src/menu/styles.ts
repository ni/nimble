import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    borderWidth,
    borderColor,
    popupBorderColor,
    groupHeaderFont,
    groupHeaderTextTransform,
    groupHeaderFontColor,
    smallPadding,
    elevation2BoxShadow,
    sectionBackgroundColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        background: ${sectionBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        min-width: 176px;
        width: max-content;
        box-shadow: ${elevation2BoxShadow};
    }

    slot {
        padding: 4px;
        display: block;
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
`;

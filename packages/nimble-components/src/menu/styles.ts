import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    borderWidth,
    borderColor,
    groupLabelTextTransform,
    groupLabelFontColor,
    groupLabelFontFamily,
    groupLabelFontSize,
    groupLabelFontWeight,
    popupBorderColor,
    popupBoxShadowColor,
    labelHeight
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}
    :host {
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        padding: 4px;
        min-width: 168px;
        width: max-content;
        box-shadow: 0px 2px 3px ${popupBoxShadowColor};
    }
    ::slotted(*) {
        padding-left: 8px;
        padding-right: 8px;
    }
    ::slotted(hr) {
        box-sizing: content-box;
        height: 2px;
        margin: 4px;
        border: none;
        background: ${borderColor};
        opacity: 0.1;
    }
    ::slotted(header) {
        display: flex;
        font-family: ${groupLabelFontFamily};
        font-size: ${groupLabelFontSize};
        font-weight: ${groupLabelFontWeight};
        line-height: ${labelHeight};
        color: ${groupLabelFontColor};
        text-transform: ${groupLabelTextTransform};
        padding-top: 4px;
        padding-bottom: 4px;
    }
`;

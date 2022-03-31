import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    fillSelectedRgbPartialColor,
    bodyFont,
    controlLabelFontColor,
    popupBorderColor,
    popupBoxShadowColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
    }

    :host([readonly]) ::slotted(nimble-picker-list ::slotted(input)) {
        display: none;
    }
`;

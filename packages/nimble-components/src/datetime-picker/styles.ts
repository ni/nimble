import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    bodyFontColor,
    bodyFont,
    standardPadding,
    controlLabelFontLineHeight,
    borderWidth,
    popupBorderColor,
    applicationBackgroundColor
} from '../theme-provider/design-tokens';
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-block')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .root {
        position: relative;
    }

    .calendar-button {
        ${standardPadding.cssCustomProperty}: 4px;
    }

    .root > input[type='datetime-local'] {
        position: absolute;
        visibility: hidden;
        top: ${controlLabelFontLineHeight};
        left: 0px;
        bottom: 0px;
    }

    nimble-anchored-region {
        padding: 16px;
        border-width: ${borderWidth};
        border-color: ${popupBorderColor};
        border-style: solid;
        background-color: ${applicationBackgroundColor};
    }
`;

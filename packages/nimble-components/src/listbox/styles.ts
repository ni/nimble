import { css } from '@microsoft/fast-element';
import { focusVisible } from '@microsoft/fast-foundation';

import {
    borderColor,
    borderColorHover,
    borderColorRgb,
    contentFontSize,
    controlHeight,
    labelFontColor,
    labelFontColorDisabled,
    fontFamily,
    contentFontColorDisabled,
    standardPadding,
    fillColorSelected
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: flex;
        flex-direction: column;
        flex-basis: 168px;
        width: 168px;
        padding: 3px;
        box-sizing: border-box;
        border: 1px solid ${borderColor};
        box-shadow: 0px 2px 3px #00000029;
        background-color: white;
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
        cursor: default;
    }
`;

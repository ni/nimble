import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        align-items: center;
        height: ${controlHeight};
        box-sizing: border-box;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .separator {
        display: inline-block;
        height: 24px;
        border-left: calc(${borderWidth} * 2) solid
            rgba(${borderRgbPartialColor}, 0.3);
        margin: calc(${standardPadding} / 4) calc(${standardPadding} / 2);
    }
`;

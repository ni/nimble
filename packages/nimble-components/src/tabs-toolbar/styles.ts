import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColorRgb,
    borderWidth,
    contentFontColor,
    contentFontSize,
    controlHeight,
    fontFamily,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')} :host {
        align-items: center;
        height: ${controlHeight};
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
    }

    .separator {
        display: inline-block;
        height: 24px;
        border-left: calc(${borderWidth} * 2) solid rgba(${borderColorRgb}, 0.3);
        margin: calc(${standardPadding} / 4) calc(${standardPadding} / 2);
    }
`;

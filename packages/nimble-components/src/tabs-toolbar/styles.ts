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
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
        height: ${controlHeight};
    }

    .separator {
        border-left: calc(${borderWidth} * 2) solid rgba(${borderColorRgb}, 0.3);
        margin: calc(${standardPadding} / 4) calc(${standardPadding} / 2);
    }
`;

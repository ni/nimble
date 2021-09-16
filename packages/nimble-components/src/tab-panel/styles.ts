import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    contentFontColor,
    contentFontSize,
    fontFamily,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')} :host {
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
        padding-top: ${standardPadding};
    }
`;

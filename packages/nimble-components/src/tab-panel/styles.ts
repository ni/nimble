import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    contentFontColor,
    contentFontSize,
    fontFamily
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')} :host {
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
    }
`;

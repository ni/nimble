import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        color: ${bodyFontColor};
        padding-top: ${standardPadding};
    }
`;

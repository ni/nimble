import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyFont,
    bodyFontColor,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
        padding-top: ${standardPadding};
    }
`;

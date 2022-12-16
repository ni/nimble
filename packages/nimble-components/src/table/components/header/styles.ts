import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    controlHeight,
    tableHeaderFont,
    tableHeaderFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        align-items: center;
        background: ${applicationBackgroundColor};
        padding: 0px 8px;
        font: ${tableHeaderFont};
        color: ${tableHeaderFontColor};
    }
`;

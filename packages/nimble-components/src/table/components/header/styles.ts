import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    controlHeight,
    tableColumnHeaderFont,
    tableColumnHeaderFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        align-items: center;
        background: ${applicationBackgroundColor};
        padding: 0px 8px;
        font: ${tableColumnHeaderFont};
        color: ${tableColumnHeaderFontColor};
    }
`;

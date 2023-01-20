import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlHeight,
    standardPadding,
    tableHeaderFont,
    tableHeaderFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        align-items: center;
        padding: 0px calc(${standardPadding} / 2);
        font: ${tableHeaderFont};
        color: ${tableHeaderFontColor};
        text-transform: uppercase;
    }
`;

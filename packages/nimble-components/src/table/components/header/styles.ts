import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlHeight,
    controlSlimHeight,
    iconColor,
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
        ${iconColor.cssCustomProperty}: ${tableHeaderFontColor};
    }

    .title {
        text-transform: uppercase;
    }

    .sort-indicator {
        flex-shrink: 0;
        padding: 0px calc(${standardPadding} / 2);
    }

    .column-menu {
        margin-left: auto;
        width: ${controlSlimHeight};
        height: ${controlSlimHeight};
    }
`;

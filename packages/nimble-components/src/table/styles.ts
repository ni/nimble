import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyFont, bodyFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    .table-container {
        width: 100%;
        height: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .table-header {
        display: flex;
        flex-direction: row;
    }

    .table-row {
        display: flex;
        flex-direction: row;
    }

    .table-cell {
        flex: 1;
    }
`;

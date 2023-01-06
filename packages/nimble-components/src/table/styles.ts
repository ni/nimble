import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyFont, bodyFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    .table-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
        overflow: auto;
    }

    .header-container {
        position: sticky;
        top: 0;
    }

    .header-row {
        display: flex;
        flex-direction: row;
    }

    .header {
        flex: 1;
    }
`;

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyFont, bodyFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    .table-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-height: 100vh;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .table-viewport {
        overflow-y: auto;
        display: block;
        height: 100%;
        position: relative;
    }

    .table-scroll {
        pointer-events: none;
        position: absolute;
        top: 0px;
        width: 100%;
    }

    .table-row-container {
        width: 100%;
        position: sticky;
        overflow: hidden;
        top: 0px;
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

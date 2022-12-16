import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderWidth
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    .table-container {
        width: 100%;
        height: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .header-row {
        display: flex;
        flex-direction: row;
        margin-left: calc(2 * ${borderWidth});
    }

    .header {
        flex: 1;
    }
`;

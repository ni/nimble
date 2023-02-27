import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderWidth,
    controlHeight,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        height: ${controlHeight};
        border-top: calc(2 * ${borderWidth}) solid ${tableRowBorderColor};
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        width: fit-content;
        min-width: 100%;
    }

    nimble-table-cell {
        --ni-private-table-cell-action-menu-display: none;
    }

    nimble-table-cell[menu-open] {
        --ni-private-table-cell-action-menu-display: block;
    }

    :host(:hover) nimble-table-cell {
        --ni-private-table-cell-action-menu-display: block;
    }
`;

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderWidth,
    controlHeight,
    standardPadding,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid ${tableRowBorderColor};
        width: fit-content;
        min-width: 100%;
    }

    .selection-checkbox {
        margin: 0px ${standardPadding};
    }

    .selection-checkbox::part(label) {
        padding-left: 0px;
    }

    .cell-container {
        display: grid;
        width: 100%;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
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

    :host([selected]) nimble-table-cell {
        --ni-private-table-cell-action-menu-display: block;
    }
`;

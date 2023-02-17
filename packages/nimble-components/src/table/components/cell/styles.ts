import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { standardPadding } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        padding: 0px calc(${standardPadding} / 2);
        align-self: center;
        height: 100%;
        grid-template-columns: 1fr auto;
        /* A default value that will be overridden by the row */
        --ni-private-table-cell-action-menu-display: block;
    }

    .cell-content-container {
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .action-menu {
        display: var(--ni-private-table-cell-action-menu-display);
    }
`;

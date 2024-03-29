import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlHeight,
    controlSlimHeight,
    mediumPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        --ni-private-table-cell-nesting-level: 0;
        padding: 0px ${mediumPadding};
        padding-left: calc(
            ${mediumPadding} + ${controlHeight} *
                var(--ni-private-table-cell-nesting-level)
        );
        align-self: center;
        height: 100%;
        /* A default value that will be overridden by the row */
        --ni-private-table-cell-action-menu-display: block;
    }

    .cell-view {
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .action-menu {
        display: var(--ni-private-table-cell-action-menu-display);
        margin-left: auto;
        flex-shrink: 0;
        flex-grow: 0;
        height: ${controlSlimHeight};
        align-self: center;
    }
`;

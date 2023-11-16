import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlSlimHeight,
    mediumPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';
import { styles as expandCollapseStyles } from '../../../patterns/expand-collapse/styles';

export const styles = css`
    ${expandCollapseStyles}
    ${display('flex')}

    :host {
        --ni-private-table-cell-nesting-level: 0;
        padding: 0px ${mediumPadding};
        padding-left: calc(
            ${mediumPadding} + ${standardPadding} * 2 *
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
        padding-left: var(--ni-private-table-cell-view-padding);
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

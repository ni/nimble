import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlSlimHeight,
    mediumDelay,
    mediumPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
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

    :host([expanded]) .animating,
    :host .animating {
        transition: ${mediumDelay} ease-in-out;
    }

    :host([expanded]) .expander-icon {
        transform: rotate(90deg);
    }

    .expand-collapse-button {
        margin-left: calc(
            ${mediumPadding} + ${standardPadding} * 2 *
                var(--ni-private-table-group-row-indent-level)
        );
        height: ${controlSlimHeight};
        align-self: center;
    }

    .expander-icon {
        transform: rotate(0deg);
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

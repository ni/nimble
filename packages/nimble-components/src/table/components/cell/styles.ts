import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderHoverColor,
    borderWidth,
    controlSlimHeight,
    smallPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';
import { focusVisible } from '../../../utilities/style/focus';

export const styles = css`
    ${display('flex')}

    :host {
        --ni-private-table-cell-nesting-level: 0;
        padding: 0px calc(${standardPadding} / 2);
        padding-left: calc(
            ${smallPadding} * 2 + ${standardPadding} * 2 *
                var(--ni-private-table-cell-nesting-level)
        );
        align-self: center;
        height: 100%;
        /* A default value that will be overridden by the row */
        --ni-private-table-cell-action-menu-display: visible;
    }

    :host(:${focusVisible}) .cell-view {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: 1px;
    }

    .cell-view {
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-grow: 1;
    }

    .cell-view${focusVisible} {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
    }

    .action-menu {
        display: block;
        visibility: var(--ni-private-table-cell-action-menu-display);
        margin-left: auto;
        flex-shrink: 0;
        flex-grow: 0;
        height: ${controlSlimHeight};
        align-self: center;
    }
`;

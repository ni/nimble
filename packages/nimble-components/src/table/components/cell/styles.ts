import { css } from '@ni/fast-element';
import { display } from '../../../utilities/style/display';
import {
    borderHoverColor,
    borderWidth,
    controlHeight,
    controlSlimHeight,
    mediumPadding
} from '../../../theme-provider/design-tokens';
import { focusVisible } from '../../../utilities/style/focus';

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

    :host(${focusVisible}) {
        outline: calc(2 * ${borderWidth}) solid ${borderHoverColor};
        outline-offset: -2px;
    }

    .cell-view-container {
        display: contents;
    }

    .cell-view {
        overflow: hidden;
    }

    .action-menu {
        display: var(--ni-private-table-cell-action-menu-display);
        margin-left: auto;
        flex-shrink: 0;
        flex-grow: 0;
        height: ${controlSlimHeight};
        align-self: center;
    }

    ${
        /* This CSS class is applied dynamically by KeyboardNavigationManager */ ''
    }
    .action-menu.cell-action-menu-focused {
        display: block;
    }
`;

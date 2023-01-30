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
    }

    nimble-table-cell::part(action-menu) {
        display: none;
    }

    nimble-table-cell.menu-open::part(action-menu) {
        display: initial;
    }

    :host(.hover) nimble-table-cell::part(action-menu),
    :host(:hover) nimble-table-cell::part(action-menu) {
        display: initial;
    }
`;

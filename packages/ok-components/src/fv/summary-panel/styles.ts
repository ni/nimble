import { css } from '@ni/fast-element';
import { standardPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    .summary-panel {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: flex-start;
        column-gap: ${standardPadding};
    }

    .summary-item-container {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: ${standardPadding};
        min-width: 0;
    }

    .summary-item-container:empty {
        display: none;
    }

    .edit-items-button {
        align-self: start;
        justify-self: end;
    }

    ::slotted(*) {
        flex: 0 0 auto;
    }
`;
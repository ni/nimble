import { css } from '@ni/fast-element';
import {
    mediumPadding,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
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

        :host([size='compact']) .summary-item-container {
            flex-wrap: nowrap;
            box-sizing: border-box;
            overflow-x: auto;
            overflow-y: hidden;
            gap: ${mediumPadding};
            padding: calc(${standardPadding} - ${smallPadding});
            scrollbar-width: none;
        }

        :host([size='compact']) .summary-item-container.has-overflow {
            -webkit-mask-image: linear-gradient(to right, black calc(100% - 48px), transparent);
            mask-image: linear-gradient(to right, black calc(100% - 48px), transparent);
        }

        :host([size='compact']) .summary-item-container::-webkit-scrollbar {
            display: none;
        }

        .edit-items-button {
            align-self: start;
            justify-self: end;
        }

        ::slotted(*) {
            flex: 0 0 auto;
        }
    }

    @layer hover {}

    @layer focusVisible {}

    @layer active {}

    @layer disabled {}

    @layer top {}
`;
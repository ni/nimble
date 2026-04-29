import { css } from '@ni/fast-element';
import {
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    .toolbar {
        display: flex;
        align-items: center;
        gap: ${standardPadding};
        width: 100%;
    }

    .toolbar-primary,
    .toolbar-end {
        display: flex;
        align-items: center;
        min-width: 0;
    }

    .toolbar-end {
        margin-inline-start: auto;
    }

    .toolbar-primary > slot,
    .toolbar-end > slot {
        display: flex;
        align-items: center;
    }

    .toolbar-end > slot {
        gap: ${standardPadding};
        justify-content: flex-end;
    }

    ::slotted(*) {
        flex: 0 0 auto;
    }
`;
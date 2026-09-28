import { css } from '@ni/fast-element';
import {
    bodyFontColor,
    smallPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        min-width: 0;
        color: ${bodyFontColor};
    }

    .input-row {
        display: flex;
        gap: ${smallPadding};
        min-width: 0;
        align-items: baseline;
        overflow-wrap: anywhere;
        text-align: start;
    }

    .input-name {
        flex: 0 0 auto;
        font-weight: 600;
    }

    .input-value {
        min-width: 0;
        white-space: pre-wrap;
        user-select: text;
    }
`;
import { css } from '@ni/fast-element';

import {
    bodyFont,
    bodyFontColor,
    standardPadding,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        min-width: ${standardPadding};
        min-height: ${standardPadding};
        max-width: 90%;

        flex-direction: row;
        justify-content: center;
        align-self: center;
        flex-shrink: 0;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .message-content {
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        overflow-x: auto;
    }
`;

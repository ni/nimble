import { css } from '@ni/fast-element';

import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    mediumPadding,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        min-width: 16px;
        min-height: 16px;

        flex-direction: row;
        justify-content: flex-end;
        flex-shrink: 0;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .container {
        display: flex;
        flex-direction: column;
        max-width: calc(90%);
    }

    .message-content {
        width: fit-content;
        height: fit-content;
        overflow-x: auto;
    }

    :host .message-content {
        background: ${fillSelectedColor};
        border: ${borderWidth} solid ${borderHoverColor};
        border-radius: ${mediumPadding} ${mediumPadding} 0px ${mediumPadding};
        padding: ${mediumPadding};
    }
`;

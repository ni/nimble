import { css } from '@ni/fast-element';

import {
    bodyFont,
    bodyFontColor,
    mediumPadding,
    standardPadding,
    subtitleFont,
    subtitleFontColor,
    titlePlus1Font,
    titlePlus1FontColor,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        min-width: ${standardPadding};
        min-height: ${standardPadding};

        flex-direction: row;
        justify-content: center;
        flex-shrink: 0;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: calc(90%);
        gap: ${mediumPadding};
    }

    .brand-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title {
        font: ${titlePlus1Font};
        color: ${titlePlus1FontColor};
        text-align: center;
    }

    .subtitle {
        font: ${subtitleFont};
        color: ${subtitleFontColor};
        text-align: center;
    }

    .message-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        height: fit-content;
        overflow-x: auto;
        gap: ${mediumPadding};
    }
`;

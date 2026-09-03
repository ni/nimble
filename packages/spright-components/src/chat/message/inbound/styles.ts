import { css } from '@ni/fast-element';
import { anchorButtonTag } from '@ni/nimble-components/dist/esm/anchor-button';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import { toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';

import {
    bodyFont,
    bodyFontColor,
    controlSlimHeight,
    largePadding,
    mediumPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        min-width: ${standardPadding};
        min-height: ${standardPadding};
        max-width: 100%;

        flex-direction: row;
        justify-content: flex-start;
        align-self: flex-start;
        flex-shrink: 0;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    [part='start'] {
        display: none;
    }

    .message-content {
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        overflow-x: auto;
    }

    .footer-actions {
        display: none;
    }

    :host .footer-actions.has-content {
        display: flex;
        column-gap: ${standardPadding};
        margin-top: ${mediumPadding};
    }

    .footer-actions ::slotted(${buttonTag}),
    .footer-actions ::slotted(${toggleButtonTag}),
    .footer-actions ::slotted(${anchorButtonTag}),
    .footer-actions ::slotted(${menuButtonTag}) {
        height: ${controlSlimHeight};
    }

    .end {
        display: none;
    }

    :host .end {
        display: flex;
        column-gap: ${standardPadding};
        margin-top: ${largePadding};
    }
`;

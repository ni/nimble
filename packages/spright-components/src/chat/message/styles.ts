import { css } from '@ni/fast-element';
import { anchorButtonTag } from '@ni/nimble-components/dist/esm/anchor-button';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import { toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';

import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlSlimHeight,
    fillSelectedColor,
    largePadding,
    mediumPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        min-width: 16px;
        min-height: 16px;

        flex-direction: row;
        justify-content: center;
        flex-shrink: 0;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    :host([message-type='outbound']) {
        justify-content: flex-end;
    }

    :host([message-type='inbound']) {
        justify-content: flex-start;
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

    :host([message-type='outbound']) .message-content {
        background: ${fillSelectedColor};
        border: ${borderWidth} solid ${borderHoverColor};
        border-radius: ${mediumPadding} ${mediumPadding} 0px ${mediumPadding};
        padding: ${mediumPadding};
    }

    .footer-actions {
        display: flex;
        column-gap: ${standardPadding};
        margin-top: ${mediumPadding};
    }

    ::slotted(${buttonTag}),
    ::slotted(${toggleButtonTag}),
    ::slotted(${anchorButtonTag}),
    ::slotted(${menuButtonTag}) {
        height: ${controlSlimHeight};
    }

    .end {
        display: flex;
        column-gap: ${standardPadding};
        margin-top: ${largePadding};
    }

    [part='start'] {
        display: none;
    }
`;

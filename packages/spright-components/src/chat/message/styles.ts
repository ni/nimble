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
import { ChatMessageType } from './types';

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

    :host([message-type='${ChatMessageType.outbound}']) {
        justify-content: flex-end;
    }

    :host([message-type='${ChatMessageType.inbound}']) {
        justify-content: flex-start;
    }

    .container {
        display: flex;
        flex-direction: column;
        max-width: calc(90%);
    }

    [part='start'] {
        display: none;
    }

    .message-content {
        width: fit-content;
        height: fit-content;
        overflow-x: auto;
    }

    :host([message-type='${ChatMessageType.outbound}']) .message-content {
        background: ${fillSelectedColor};
        border: ${borderWidth} solid ${borderHoverColor};
        border-radius: ${mediumPadding} ${mediumPadding} 0px ${mediumPadding};
        padding: ${mediumPadding};
    }

    .footer-actions {
        display: none;
    }

    :host([message-type='${ChatMessageType.inbound}'])
        .footer-actions.has-content {
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

    :host([message-type='${ChatMessageType.inbound}']) .end {
        display: flex;
        column-gap: ${standardPadding};
        margin-top: ${largePadding};
    }
`;

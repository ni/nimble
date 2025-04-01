import { css } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';

import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlSlimHeight,
    fillSelectedColor,
    mediumPadding
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

    .root {
        max-width: calc(90%);
    }

    .message-content {
        width: fit-content;
        height: fit-content;
        padding: ${mediumPadding};
        overflow-x: auto;
    }

    :host([message-type='outbound']) .message-content {
        background: ${fillSelectedColor};
        border: ${borderWidth} solid ${borderHoverColor};
        border-radius: 8px 8px 0px 8px;
    }

    :host([message-type='inbound']) .message-content {
        border-radius: 8px 8px 8px 0px;
        padding: 6px;
    }

    .footer-actions::slotted(${buttonTag}),
    .footer-actions::slotted(${toggleButtonTag}) {
        height: ${controlSlimHeight};
        width: ${controlSlimHeight};
        margin: 0px 16px 0px 0px;
    }

    [part='start'] {
        display: none;
    }

    [part='end'] ::slotted(*) {
        margin: 24px 16px 0px 0px;
    }
`;

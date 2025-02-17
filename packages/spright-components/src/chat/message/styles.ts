import { css } from '@microsoft/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
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
    }

    .actions {
        display: flex;
        justify-content: space-between;
    }

    :host .actions.center > slot {
        display: none;
    }

    :host([message-type='outbound']):host(:hover) .actions.center > slot {
        display: flex;
        margin: auto;
    }

    .left {
        display: flex;
        justify-content: flex-start;
    }

    .right {
        display: flex;
        justify-content: flex-end;
    }

    .left::slotted(${buttonTag}) {
        height: ${controlSlimHeight};
        width: ${controlHeight};
        margin: 0px 16px 0px 0px;
    }

    .right::slotted(${buttonTag}) {
        height: ${controlSlimHeight};
        width: ${controlHeight};
        margin: 0px 0px 0px 16px;
    }
`;

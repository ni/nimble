import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';

import {
    borderColor,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform,
    smallPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        cursor: default;
        flex-direction: column;
    }

    :host([visually-hidden]) {
        display: none;
    }

    :host::after,
    :host::before {
        content: ' ';
        margin-top: ${smallPadding};
        margin-bottom: ${smallPadding};
        border-bottom: ${borderColor} 2px solid;
        opacity: 0.1;
        display: none;
    }

    :host([show-top-separator])::before,
    :host([show-bottom-separator])::after {
        display: block;
    }

    slot[name='options-slot']::slotted([role='option']) {
        background-color: transparent;
    }

    slot[name='options-slot']::slotted([role='option']:hover) {
        background-color: ${fillHoverColor};
    }

    slot[name='options-slot']::slotted([role='option'][active-option]) {
        background-color: ${fillSelectedColor};
    }

    slot[name='options-slot']::slotted([role='option'][active-option]:hover) {
        background-color: ${fillHoverSelectedColor};
    }

    .label-display {
        font: ${groupHeaderFont};
        text-transform: ${groupHeaderTextTransform};
        color: ${groupHeaderFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: ${smallPadding};
        margin-bottom: ${smallPadding};
    }

    .label-slot.hidden {
        display: none;
    }
`;

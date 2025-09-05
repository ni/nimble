import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyEmphasizedFont,
    linkFontColor,
    linkProminentFontColor,
    smallPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: row;
    }

    .scroll-button.left {
        margin-right: ${smallPadding};
    }
    .list {
        display: flex;
        max-width: 100%;
        width: max-content;
        align-self: end;
        overflow-x: scroll;
        scrollbar-width: none;
    }
    .scroll-button.right {
        margin-left: ${smallPadding};
    }

    ::slotted(*) {
        flex-shrink: 0;
        white-space: nowrap;
    }

    ::slotted(:last-child) {
        font: ${bodyEmphasizedFont};
        color: ${linkFontColor};
    }

    :host([appearance='prominent']) ::slotted(:last-child) {
        color: ${linkProminentFontColor};
    }
`;

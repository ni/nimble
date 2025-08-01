import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyEmphasizedFont,
    linkFontColor,
    linkProminentFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    .list {
        display: flex;
    }

    ::slotted(*) {
        flex-shrink: 0;
        min-width: 0;
    }

    ::slotted(:last-child) {
        font: ${bodyEmphasizedFont};
        color: ${linkFontColor};
        flex-shrink: 1;
    }

    :host([appearance='prominent']) ::slotted(:last-child) {
        color: ${linkProminentFontColor};
    }
`;

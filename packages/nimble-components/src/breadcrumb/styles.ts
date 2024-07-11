import { css } from '@microsoft/fast-element';
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
        flex-wrap: wrap;
    }

    ::slotted(:last-child) {
        font: ${bodyEmphasizedFont};
        color: ${linkFontColor};
    }

    :host([appearance='prominent']) ::slotted(:last-child) {
        color: ${linkProminentFontColor};
    }
`;

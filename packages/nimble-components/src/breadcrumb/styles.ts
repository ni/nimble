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

    ::slotted(*:first-child) {
        padding-left: 0px;
    }

    ::slotted(*:not([href]):last-child) {
        font: ${bodyEmphasizedFont};
        color: ${linkFontColor};
    }

    :host([appearance='prominent']) ::slotted(*:not([href]):last-child) {
        color: ${linkProminentFontColor};
    }
`;

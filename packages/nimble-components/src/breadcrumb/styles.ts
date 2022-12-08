import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyEmphasizedFont, linkActiveFontColor, linkActiveProminentFontColor, linkFont, linkFontColor, linkProminentFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${linkFont};
        --ni-private-breadcrumb-link-font-color: ${linkFontColor};
        --ni-private-breadcrumb-link-active-font-color: ${linkActiveFontColor};
    }

    :host([appearance='prominent']) {
        --ni-private-breadcrumb-link-font-color: ${linkProminentFontColor};
        --ni-private-breadcrumb-link-active-font-color: ${linkActiveProminentFontColor};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }

    ::slotted(*:first-child) {
        padding-left: 0px;
    }

    ::slotted(*:not([href]):last-child) {
        font: ${bodyEmphasizedFont};
    }
`;

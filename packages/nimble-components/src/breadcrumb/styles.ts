import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyEmphasizedFont,
    bodyFont,
    bodyFontColor,
    breadcrumb2FontColor,
    breadcrumbActiveFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        --ni-private-breadcrumb-link-font-color: ${bodyFontColor};
        --ni-private-breadcrumb-link-active-font-color: ${breadcrumbActiveFontColor};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }

    :host(.style-2) {
        --ni-private-breadcrumb-link-font-color: ${breadcrumb2FontColor};
        --ni-private-breadcrumb-link-active-font-color: ${bodyFontColor};
    }

    ::slotted(*:first-child) {
        padding-left: 0px;
    }

    ::slotted(*:not([href]):last-child) {
        font: ${bodyEmphasizedFont};
    }
`;

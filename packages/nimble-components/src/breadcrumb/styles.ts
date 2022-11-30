import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyEmphasizedFont,
    bodyFont
} from '../theme-provider/design-tokens';
import { linkColors } from '../patterns/link/styles';

export const styles = css`
    ${display('inline-block')}
    ${linkColors}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
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

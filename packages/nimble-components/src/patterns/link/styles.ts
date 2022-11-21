import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    controlHeight,
} from '../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        box-sizing: border-box;
        font: ${bodyFont};
        color: ${bodyFontColor};
        outline: none;
    }

    .control {
        color: var(--ni-private-link-font-color);
        cursor: default;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
    }

    .control:any-link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control:active {
        color: var(--ni-private-link-active-font-color);
        text-decoration: underline;
    }
`;

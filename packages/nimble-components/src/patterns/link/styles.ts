import { css } from '@microsoft/fast-element';
import {
    linkActiveDisabledFontColor,
    linkActiveFont,
    linkActiveFontColor,
    linkDisabledFontColor,
    linkFont,
    linkFontColor
} from '../../theme-provider/design-tokens';

export const linkStyles = css`
    :host {
        box-sizing: border-box;
        font: ${linkFont};
    }

    .control {
        color: ${linkFontColor};
        cursor: default;
    }

    .control:any-link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control:active {
        font: ${linkActiveFont};
        color: ${linkActiveFontColor};
        text-decoration: underline;
    }

    .control:not(:any-link) {
        color: ${linkDisabledFontColor};
        text-decoration: none;
    }

    .control:not(:any-link):active {
        color: ${linkActiveDisabledFontColor};
    }
`;

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    linkActiveDisabledFontColor,
    linkActiveFont,
    linkActiveFontColor,
    linkActiveProminentFont,
    linkActiveProminentFontColor,
    linkDisabledFontColor,
    linkFont,
    linkFontColor,
    linkProminentFont,
    linkProminentFontColor,
    linkProminentDisabledFontColor
} from '../../theme-provider/design-tokens';

export const linkStyles = css`
    :host {
        box-sizing: border-box;
        font: ${linkFont};
    }

    .control {
        display: inline;
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

    :host([appearance='prominent']) .control {
        font: ${linkProminentFont};
        color: ${linkProminentFontColor};
    }

    :host([appearance='prominent']) .control:active {
        font: ${linkActiveProminentFont};
        color: ${linkActiveProminentFontColor};
    }

    :host([appearance='prominent']) .control:not(:any-link) {
        font: ${linkProminentFont};
        color: ${linkProminentDisabledFontColor};
    }

    .control:not(:any-link) {
        color: ${linkDisabledFontColor};
        text-decoration: none;
    }

    .control:not(:any-link):active {
        color: ${linkActiveDisabledFontColor};
    }
`;

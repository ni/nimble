import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    linkActiveDisabledFontColor,
    linkActiveFontColor,
    linkActiveProminentFontColor,
    linkDisabledFontColor,
    linkFont,
    linkFontColor,
    linkProminentDisabledFontColor,
    linkProminentFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline')}

    :host {
        box-sizing: border-box;
        font: ${linkFont};
    }

    [part='start'] {
        display: none;
    }

    .control {
        color: ${linkFontColor};
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control${focusVisible} {
        display: inline;
        outline: none;
        text-decoration: underline;
        box-shadow: inset 0px -1px ${linkFontColor};
    }

    .control:active {
        color: ${linkActiveFontColor};
        text-decoration: underline;
    }

    .control${focusVisible}:active {
        box-shadow: inset 0px -1px ${linkActiveFontColor};
    }

    :host([underline-visible]) .control {
        text-decoration: underline;
    }

    .control:not(:any-link) {
        color: ${linkDisabledFontColor};
        text-decoration: none;
    }

    .control:not(:any-link):active {
        color: ${linkActiveDisabledFontColor};
    }

    :host([appearance='prominent']) .control {
        color: ${linkProminentFontColor};
    }

    :host([appearance='prominent']) .control:active {
        color: ${linkActiveProminentFontColor};
    }

    :host([appearance='prominent']) .control${focusVisible} {
        box-shadow: inset 0px -1px ${linkProminentFontColor};
    }

    :host([appearance='prominent']) .control${focusVisible}:active {
        box-shadow: inset 0px -1px ${linkActiveProminentFontColor};
    }

    :host([appearance='prominent']) .control:not(:any-link) {
        color: ${linkProminentDisabledFontColor};
    }

    [part='end'] {
        display: none;
    }
`;

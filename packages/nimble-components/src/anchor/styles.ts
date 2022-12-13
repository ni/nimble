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
        text-decoration: underline;
    }

    .control${focusVisible} {
        display: inline;
        outline: none;
        box-shadow: inset 0px -1px ${linkFontColor};
    }

    .control:active {
        color: ${linkActiveFontColor};
        text-decoration: underline;
    }

    .control${focusVisible}:active {
        box-shadow: inset 0px -1px ${linkActiveFontColor};
    }

    .control:not(:any-link) {
        color: ${linkDisabledFontColor};
        text-decoration: none;
    }

    .control:not(:any-link):active {
        color: ${linkActiveDisabledFontColor};
    }

    :host([underline-hidden]) .control {
        text-decoration: none;
    }

    :host([underline-hidden]) .control:hover {
        text-decoration: underline;
    }

    :host([underline-hidden]) .control${focusVisible} {
        text-decoration: underline;
    }

    :host([underline-hidden]) .control:not(:any-link) {
        text-decoration: none;
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

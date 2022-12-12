import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import { linkStyles } from '../patterns/link/styles';
import {
    linkActiveProminentFont,
    linkActiveProminentFontColor,
    linkProminentDisabledFontColor,
    linkProminentFont,
    linkProminentFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${linkStyles}
    ${display('inline')}

    [part="start"] {
        display: none;
    }

    .control${focusVisible} {
        display: inline;
        outline: none;
        text-decoration: underline;
        box-shadow: inset 0px -1px var(--ni-private-link-font-color);
    }

    .control${focusVisible}:active {
        box-shadow: inset 0px -1px var(--ni-private-link-active-font-color);
    }

    :host([underline-visible]) .control {
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

    [part='end'] {
        display: none;
    }
`;

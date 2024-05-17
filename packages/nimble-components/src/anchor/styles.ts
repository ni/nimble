import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    linkActiveFontColor,
    linkActiveProminentFontColor,
    linkDisabledFontColor,
    linkFont,
    linkFontColor,
    linkProminentFontColor,
    linkActiveVisitedColor,
    linkVisitedColor
} from '../theme-provider/design-tokens';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled;

    @layer base {
        ${display('inline')}

        :host {
            box-sizing: border-box;
            font: ${linkFont};
        }

        .top-container {
            display: contents;
        }

        .control {
            color: ${linkFontColor};
            text-decoration: underline;
        }

        :host([underline-hidden]) .control {
            text-decoration: none;
        }

        :host([appearance='prominent']) .control {
            color: ${linkProminentFontColor};
        }

        .control:visited {
            color: ${linkVisitedColor};
        }

        [part='start'] {
            display: none;
        }

        .content {
            pointer-events: none;
        }

        [part='end'] {
            display: none;
        }
    }

    @layer hover {
        .control:any-link:hover {
            text-decoration: underline;
        }
    }

    @layer focusVisible {
        .control${focusVisible} {
            outline: none;
            box-shadow: inset 0px -1px;
            text-decoration: underline;
        }
    }

    @layer active {
        .control:active {
            color: ${linkActiveFontColor};
            text-decoration: underline;
        }

        :host([appearance='prominent']) .control:active {
            color: ${linkActiveProminentFontColor};
        }

        .control:active:visited {
            color: ${linkActiveVisitedColor};
        }

        :host([underline-hidden]) .control:active {
            text-decoration: none;
        }
    }

    @layer disabled {
        .control:not(:any-link) {
            color: ${linkDisabledFontColor};
        }
    }
`;

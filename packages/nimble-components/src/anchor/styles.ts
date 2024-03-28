import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    linkActiveFontColor,
    linkActiveProminentFontColor,
    linkDisabledFontColor,
    linkFont,
    linkFontColor,
    linkProminentFontColor
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

        [part='start'] {
            display: none;
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
            box-shadow: none;
        }

        :host([appearance='prominent']) .control:active {
            color: ${linkActiveProminentFontColor};
        }

        ${
            '' /* It's probably cleaner to add :not(active) to the selector in the 'active' layer (rather
                than resetting text-decoration back to the value from the 'default' layer), but
                there's a bug in storybook-addon-pseudo-states where it doesn't handle :not() properly. */
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

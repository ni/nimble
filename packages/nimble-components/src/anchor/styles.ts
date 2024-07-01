import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import { focusVisible } from '../utilities/style/focus';
import {
    borderHoverColor,
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
            color: ${borderHoverColor};
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

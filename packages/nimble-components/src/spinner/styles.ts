import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    Black15,
    Black91,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-block')}

    :host {
        width: 32px;
        height: 32px;
    }

    :host([size='small']) {
        width: 16px;
        height: 16px;
    }

    :host([size='medium-large']) {
        width: 48px;
        height: 48px;
    }

    :host([size='large']) {
        width: 64px;
        height: 64px;
    }

    :host([size='x-large']) {
        width: 96px;
        height: 96px;
    }

    :host([size='xx-large']) {
        width: 128px;
        height: 128px;
    }

    div.container {
        width: 87.5%;
        height: 87.5%;
        top: 6.25%;
        left: 6.25%;
        position: relative;
    }

    :host([size='small']) div.container {
        width: 12px;
        height: 12px;
        top: 2px;
        left: 2px;
    }

    :host([size='medium-large']) div.container {
        width: 40px;
        height: 40px;
        top: 4px;
        left: 4px;
    }

    :host([size='x-large']) div.container {
        width: 80px;
        height: 80px;
        top: 8px;
        left: 8px;
    }

    div.bit1,
    div.bit2 {
        background: var(--ni-private-spinner-bits-background-color);
        width: 50%;
        height: 50%;
        margin: auto;
        animation-duration: 1600ms;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.65, 0, 0.35, 0);
    }

    div.bit1 {
        animation-name: ni-private-spinner-keyframes-1;
    }

    div.bit2 {
        animation-name: ni-private-spinner-keyframes-2;
    }

    @media (prefers-reduced-motion) {
        div.bit1,
        div.bit2 {
            animation-timing-function: ease-in-out, steps(1);
            animation-duration: 3200ms;
        }

        div.bit1 {
            animation-name: ni-private-spinner-no-motion-opacity-keyframes,
                ni-private-spinner-no-motion-transform-keyframes-1;
        }

        div.bit2 {
            animation-name: ni-private-spinner-no-motion-opacity-keyframes,
                ni-private-spinner-no-motion-transform-keyframes-2;
        }
    }

    @keyframes ni-private-spinner-keyframes-1 {
        0%,
        100% {
            transform: translate(-50%, 0);
        }

        25% {
            transform: translate(50%, 0);
        }

        50% {
            transform: translate(50%, 100%);
        }

        75% {
            transform: translate(-50%, 100%);
        }
    }

    @keyframes ni-private-spinner-keyframes-2 {
        0%,
        100% {
            transform: translate(50%, 0);
        }

        25% {
            transform: translate(-50%, 0);
        }

        50% {
            transform: translate(-50%, -100%);
        }

        75% {
            transform: translate(50%, -100%);
        }
    }

    @keyframes ni-private-spinner-no-motion-opacity-keyframes {
        0%,
        50%,
        100% {
            opacity: 0;
        }

        25%,
        75% {
            opacity: 1;
        }
    }

    @keyframes ni-private-spinner-no-motion-transform-keyframes-1 {
        0%,
        100% {
            transform: translate(-50%, 0);
        }
        50% {
            transform: translate(50%, 0);
        }
    }

    @keyframes ni-private-spinner-no-motion-transform-keyframes-2 {
        0%,
        100% {
            transform: translate(50%, 0);
        }

        50% {
            transform: translate(-50%, 0);
        }
    }
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            :host {
                --ni-private-spinner-bits-background-color: ${hexToRgbaCssColor(
                    Black91,
                    0.6
                )};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                --ni-private-spinner-bits-background-color: ${hexToRgbaCssColor(
                    Black15,
                    0.6
                )};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                --ni-private-spinner-bits-background-color: ${hexToRgbaCssColor(
                    White,
                    0.6
                )};
            }
        `
    )
);

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    Black15,
    Black91,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('block')}

    :host {
        width: 32px;
        height: 32px;
    }

    :host([size='small']) {
        width: 16px;
        height: 16px;
    }

    :host([size='large']) {
        width: 64px;
        height: 64px;
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

    div.fade-copy {
        display: none;
    }

    div.bit1 {
        animation-name: ni-private-spinner-keyframes-1;
    }

    div.bit2 {
        animation-name: ni-private-spinner-keyframes-2;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion)
        div.fade-copy {
        display: block;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion) div.bit1,
    :host([reduced-motion-variant='fade'].prefers-reduced-motion) div.bit2 {
        position: absolute;
        animation-duration: 800ms;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion) div.bit2 {
        left: 50%;
        top: 50%;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion) div.bit1 {
        animation-name: ni-private-spinner-fade-keyframes-1a;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion) div.bit2 {
        animation-name: ni-private-spinner-fade-keyframes-2a;
        left: 50%;
        top: 50%;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion)
        div.bit1.fade-copy {
        animation-name: ni-private-spinner-fade-keyframes-1b;
        left: 50%;
    }

    :host([reduced-motion-variant='fade'].prefers-reduced-motion)
        div.bit2.fade-copy {
        animation-name: ni-private-spinner-fade-keyframes-2b;
        left: 0;
        top: 50%;
    }

    :host([reduced-motion-variant='middle-step'].prefers-reduced-motion)
        div.bit1,
    :host([reduced-motion-variant='middle-step'].prefers-reduced-motion)
        div.bit2 {
        animation-timing-function: steps(2, jump-end);
    }

    :host([reduced-motion-variant='fade-first'].prefers-reduced-motion)
        div.bit1 {
        animation-name: ni-private-spinner-fade-1-keyframes-1;
    }
    :host([reduced-motion-variant='fade-first'].prefers-reduced-motion)
        div.bit2 {
        animation-name: ni-private-spinner-fade-1-keyframes-2;
    }

    :host([reduced-motion-variant='fade-both'].prefers-reduced-motion)
        div.bit1 {
        animation-name: ni-private-spinner-fade-both-keyframes-1;
        animation-duration: 3200ms;
    }
    :host([reduced-motion-variant='fade-both'].prefers-reduced-motion)
        div.bit2 {
        animation-name: ni-private-spinner-fade-both-keyframes-2;
        animation-duration: 3200ms;
    }

    @media (prefers-reduced-motion) {
        :host([reduced-motion-variant='fade']) div.fade-copy {
            display: block;
        }

        :host([reduced-motion-variant='fade']) div.bit1,
        :host([reduced-motion-variant='fade']) div.bit2 {
            position: absolute;
            animation-duration: 800ms;
        }

        :host([reduced-motion-variant='fade']) div.bit2 {
            left: 50%;
            top: 50%;
        }

        :host([reduced-motion-variant='fade']) div.bit1 {
            animation-name: ni-private-spinner-fade-keyframes-1a;
        }

        :host([reduced-motion-variant='fade']) div.bit2 {
            animation-name: ni-private-spinner-fade-keyframes-2a;
            left: 50%;
            top: 50%;
        }

        :host([reduced-motion-variant='fade']) div.bit1.fade-copy {
            animation-name: ni-private-spinner-fade-keyframes-1b;
            left: 50%;
        }

        :host([reduced-motion-variant='fade']) div.bit2.fade-copy {
            animation-name: ni-private-spinner-fade-keyframes-2b;
            left: 0;
            top: 50%;
        }

        :host([reduced-motion-variant='middle-step']) div.bit1,
        :host([reduced-motion-variant='middle-step']) div.bit2 {
            animation-timing-function: steps(2, jump-end);
        }

        :host([reduced-motion-variant='fade-first']) div.bit1 {
            animation-name: ni-private-spinner-fade-1-keyframes-1;
        }
        :host([reduced-motion-variant='fade-first']) div.bit2 {
            animation-name: ni-private-spinner-fade-1-keyframes-2;
        }

        :host([reduced-motion-variant='fade-both']) div.bit1 {
            animation-name: ni-private-spinner-fade-both-keyframes-1;
            animation-duration: 3200ms;
        }
        :host([reduced-motion-variant='fade-both']) div.bit2 {
            animation-name: ni-private-spinner-fade-both-keyframes-2;
            animation-duration: 3200ms;
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

    @keyframes ni-private-spinner-fade-keyframes-1a {
        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0;
        }
    }

    @keyframes ni-private-spinner-fade-keyframes-1b {
        0%,
        100% {
            opacity: 0;
        }

        50% {
            opacity: 1;
        }
    }

    @keyframes ni-private-spinner-fade-keyframes-2a {
        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0;
        }
    }

    @keyframes ni-private-spinner-fade-keyframes-2b {
        0%,
        100% {
            opacity: 0;
        }

        50% {
            opacity: 1;
        }
    }

    @keyframes ni-private-spinner-fade-1-keyframes-1 {
        0%,
        100% {
            transform: translate(-50%, 0);
            opacity: 1;
        }

        50% {
            opacity: 0;
        }
    }

    @keyframes ni-private-spinner-fade-1-keyframes-2 {
        0%,
        100% {
            transform: translate(50%, 0);
            opacity: 1;
        }

        50% {
            opacity: 0;
        }
    }

    @keyframes ni-private-spinner-fade-both-keyframes-1 {
        0%,
        100% {
            transform: translate(-50%, 0);
            opacity: 0;
        }

        25% {
            opacity: 1;
        }
        49.9% {
            transform: translate(-50%, 0);
        }
        50% {
            transform: translate(50%, 0);
            opacity: 0;
        }

        75% {
            opacity: 1;
        }

        99.9% {
            transform: translate(50%, 0);
        }
    }

    @keyframes ni-private-spinner-fade-both-keyframes-2 {
        0%,
        100% {
            transform: translate(50%, 0);
            opacity: 0;
        }

        25% {
            opacity: 1;
        }
        49.9% {
            transform: translate(50%, 0);
        }
        50% {
            transform: translate(-50%, 0);
            opacity: 0;
        }

        75% {
            opacity: 1;
        }

        99.9% {
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
            :host([theme-variant='prominent']) {
                --ni-private-spinner-bits-background-color: ${PowerGreen};
            }
        `
    )
);

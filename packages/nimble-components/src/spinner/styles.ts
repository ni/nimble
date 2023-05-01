import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    Black15,
    Black91,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { spinnerSmallHeight } from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${spinnerSmallHeight};
        aspect-ratio: 1 / 1;
        --ni-private-spinner-animation-play-state: running;
    }

    div.container {
        margin: max(2px, 6.25%);
        flex: 1;
        ${
            /**
             * At some spinner sizes / browser zoom levels, the spinner bits/squares appear to slightly overlap visually.
             * If we set a color with transparency on each bit, it'll look wrong in the overlapping region (since the opacity
             * combines and affects the color at the overlapping spot).
             * Currently all 3 themes use a color with opacity = 0.6, so that's applied here on the parent element instead,
             * which avoids that issue.
             */
            ''
        }
        opacity: 0.6;
    }

    div.bit1,
    div.bit2 {
        background: var(--ni-private-spinner-bits-background-color);
        width: 50%;
        height: 50%;
        margin: auto;
        animation-duration: 1600ms;
        animation-iteration-count: infinite;
        animation-play-state: var(--ni-private-spinner-animation-play-state);
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
                --ni-private-spinner-bits-background-color: ${Black91}
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                --ni-private-spinner-bits-background-color: ${Black15};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                --ni-private-spinner-bits-background-color: ${White};
            }
        `
    )
);

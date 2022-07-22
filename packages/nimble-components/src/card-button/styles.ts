import { css } from '@microsoft/fast-element';
import { Black, Black15, Black91, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { focusVisible } from '../utilities/style/focus';

import {
    borderWidth,
    smallDelay,
    buttonLabelFont,
    buttonLabelFontColor
} from '../theme-provider/design-tokens';
import { themeBehavior } from '../utilities/style/theme';
import { hexToRgbaCssColor } from '../utilities/style/colors';

export const styles = css`
    :host {
        background-color: transparent;
        color: ${buttonLabelFontColor};
        font: ${buttonLabelFont};
        cursor: pointer;
        outline: none;
        border: none;
        box-sizing: border-box;
    }

    :host([disabled]) {
        cursor: default;
    }

    .control {
        background-color: transparent;
        height: 100%;
        width: 100%;
        border: ${borderWidth} solid var(--ni-private-background-color);
        --ni-private-background-color: transparent;
        box-sizing: border-box;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: inherit;
        font: inherit;
        outline: none;
        margin: 0;
        transition: box-shadow ${smallDelay};
    }

    .control:hover {
        background: var(--ni-private-card-button-background-hover-color);
        box-shadow: 0px 1px 4px var(--ni-private-card-button-box-shadow-hover-color);
    }

    .control${focusVisible} {
        ${
            /*
                TODO: get focus visible states from Brandon
            */ ''
        }
    }

    .control:active {
        background: var(--ni-private-card-button-background-active-color);
        --ni-private-background-color: var(--ni-private-card-button-border-active-color);
        box-shadow: none;
    }

    :host([selected]) .control {
        background: var(--ni-private-card-button-background-active-color);
        --ni-private-background-color: var(--ni-private-card-button-border-selected-color);
        box-shadow: none;
    }

    :host([selected]:not([disabled])) .control:hover {
        background: var(--ni-private-card-button-background-active-color);
        --ni-private-background-color: var(--ni-private-card-button-border-selected-color);
        box-shadow: 0px 1px 4px var(--ni-private-card-button-box-shadow-hover-color);
    }

    .control[disabled] {
        background: transparent;
        box-shadow: none;
        opacity: 0.3;
    }

    .content {
        display: contents;
    }

    slot[name='start'] {
        display: none;
    }

    slot[name='end'] {
        display: none;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }
`
    // prettier-ignore
    .withBehaviors(
        themeBehavior(
            css`
            ${'' /* Light theme */}
            :host {
                --ni-private-card-button-box-shadow-hover-color: ${hexToRgbaCssColor(
                    Black,
                    0.3
                )};
                --ni-private-card-button-background-hover-color: ${hexToRgbaCssColor(
                    White,
                    0.3
                )};
                --ni-private-card-button-background-active-color: ${White};
                --ni-private-card-button-border-active-color: ${hexToRgbaCssColor(
                    Black91,
                    0.2
                )};
                --ni-private-card-button-border-selected-color: ${hexToRgbaCssColor(
                    Black91,
                    0.6
                )};
            }
        `,
            css`
            ${'' /* Dark theme */}
            :host {
                --ni-private-card-button-box-shadow-hover-color: ${hexToRgbaCssColor(
                    Black,
                    0.77
                )};
                --ni-private-card-button-background-hover-color: ${hexToRgbaCssColor(
                    Black15,
                    0.07
                )};
                --ni-private-card-button-background-active-color: ${hexToRgbaCssColor(
                    Black15,
                    0.15
                )};
                --ni-private-card-button-border-active-color: ${hexToRgbaCssColor(
                    Black15,
                    0.2
                )};
                --ni-private-card-button-border-selected-color: ${Black15};
            }
        `,
            css`
            ${'' /* Color theme */}
            :host {                
                --ni-private-card-button-box-shadow-hover-color: ${hexToRgbaCssColor(
                    White,
                    0.77
                )};
                --ni-private-card-button-background-hover-color: ${hexToRgbaCssColor(
                    White,
                    0.2
                )};
                --ni-private-card-button-background-active-color: ${hexToRgbaCssColor(
                    White,
                    0.4
                )};
                --ni-private-card-button-border-active-color: ${hexToRgbaCssColor(
                    White,
                    0.2
                )};
                --ni-private-card-button-border-selected-color: ${hexToRgbaCssColor(
                    White,
                    0.6
                )};
            }
        `
        )
    );

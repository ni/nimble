import { css } from '@microsoft/fast-element';
import {
    Black,
    Black15,
    Black91,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

import {
    borderWidth,
    smallDelay,
    buttonLabelFont,
    buttonLabelFontColor,
    borderHoverColor
} from '../theme-provider/design-tokens';
import { themeBehavior } from '../utilities/style/theme';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { Theme } from '../theme-provider/types';

// prettier-ignore
export const styles = css`
    ${display('inline-flex')}

    :host {
        background-color: transparent;
        color: ${buttonLabelFontColor};
        font: ${buttonLabelFont};
        cursor: pointer;
        outline: none;
        border: none;
        box-sizing: border-box;
    }

    :host(:hover) {
        box-shadow: 0px 1px 4px
            var(--ni-private-card-button-box-shadow-hover-color);
    }

    :host(:active) {
        box-shadow: none;
    }

    :host([disabled]) {
        cursor: default;
        box-shadow: none;
    }

    .control {
        background-color: transparent;
        height: 100%;
        width: 100%;
        border: ${borderWidth} solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font: inherit;
        outline: none;
        transition: box-shadow ${smallDelay};
        padding: 0px;
    }

    .control:hover {
        background: var(--ni-private-card-button-background-hover-color);
    }

    .control${focusVisible} {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        border-color: ${borderHoverColor};
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -4px;
    }

    .control:active {
        background: var(--ni-private-card-button-background-active-color);
        border-color: var(--ni-private-card-button-border-active-color);
        outline: none;
        box-shadow: none;
    }

    :host([selected]) .control {
        background: var(--ni-private-card-button-background-active-color);
        border-color: var(--ni-private-card-button-border-selected-color);
    }

    :host([selected]) .control${focusVisible} {
        border-color: ${borderHoverColor};
    }

    :host([selected]) .control:active {
        border-color: var(--ni-private-card-button-border-active-color);
    }

    :host([selected]) .control${focusVisible}:active {
        outline: none;
        box-shadow: none;
    }

    .control[disabled] {
        background: transparent;
        opacity: 0.3;
    }

    .control[disabled]:active {
        border-color: transparent;
    }

    :host([selected]) .control[disabled]:active {
        border-color: var(--ni-private-card-button-border-selected-color);
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
`.withBehaviors(
        themeBehavior(
            Theme.light,
            css`
                :host {
                    --ni-private-card-button-box-shadow-hover-color: ${hexToRgbaCssColor(Black, 0.3)};
                    --ni-private-card-button-background-hover-color: ${hexToRgbaCssColor(White, 0.3)};
                    --ni-private-card-button-background-active-color: ${White};
                    --ni-private-card-button-border-active-color: ${hexToRgbaCssColor(Black91, 0.2)};
                    --ni-private-card-button-border-selected-color: ${hexToRgbaCssColor(Black91, 0.6)};
                }
            `
        ), themeBehavior(
            Theme.dark,
            css`
                :host {
                    --ni-private-card-button-box-shadow-hover-color: ${hexToRgbaCssColor(Black, 0.77)};
                    --ni-private-card-button-background-hover-color: ${hexToRgbaCssColor(Black15, 0.07)};
                    --ni-private-card-button-background-active-color: ${hexToRgbaCssColor(Black15, 0.15)};
                    --ni-private-card-button-border-active-color: ${hexToRgbaCssColor(Black15, 0.2)};
                    --ni-private-card-button-border-selected-color: ${Black15};
                }
            `
        ), themeBehavior(
            Theme.color,
            css`
                :host {
                    --ni-private-card-button-box-shadow-hover-color: ${hexToRgbaCssColor(White, 0.77)};
                    --ni-private-card-button-background-hover-color: ${hexToRgbaCssColor(White, 0.2)};
                    --ni-private-card-button-background-active-color: ${hexToRgbaCssColor(White, 0.4)};
                    --ni-private-card-button-border-active-color: ${hexToRgbaCssColor(White, 0.2)};
                    --ni-private-card-button-border-selected-color: ${hexToRgbaCssColor(White, 0.6)};
                }
            `
        )
    );

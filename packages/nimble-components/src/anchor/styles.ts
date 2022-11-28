import { css } from '@microsoft/fast-element';
import {
    DigitalGreenDark,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { focusVisible } from '../utilities/style/focus';
import { themeBehavior } from '../utilities/style/theme';
import { styles as linkStyles } from '../patterns/link/styles';

export const styles = css`
    ${linkStyles}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        --ni-private-link-font-color: ${bodyFontColor};
    }

    :host([inline]) {
        height: auto;
    }

    .start {
        display: none;
    }

    .control {
        height: fit-content;
        align-self: center;
    }

    .control:any-link${focusVisible} {
        text-decoration: underline;
        box-shadow: inset 0px -1px var(--ni-private-link-font-color);
    }

    :host([inline]) .control {
        display: inline;
    }

    :host([inline]) .control:any-link {
        text-decoration: underline;
    }

    :host([disabled]) .control {
        --ni-private-link-font-color: ${bodyDisabledFontColor};
        pointer-events: none;
        cursor: default;
    }

    .end {
        display: none;
    }
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            :host {
                --ni-private-link-active-font-color: ${DigitalGreenDark};
            }

            :host([prominent]) {
                --ni-private-link-font-color: var(
                    --ni-private-link-active-font-color
                );
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                --ni-private-link-active-font-color: ${PowerGreen};
            }

            :host([prominent]) {
                --ni-private-link-font-color: var(
                    --ni-private-link-active-font-color
                );
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                --ni-private-link-active-font-color: ${hexToRgbaCssColor(
                    White,
                    0.6
                )};
            }

            :host([prominent]) {
                --ni-private-link-font-color: var(
                    --ni-private-link-active-font-color
                );
            }
        `
    )
);

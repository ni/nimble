import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    DigitalGreenDark,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { bodyDisabledFontColor, bodyFont, bodyFontColor } from '../../theme-provider/design-tokens';
import { Theme } from '../../theme-provider/types';
import { hexToRgbaCssColor } from '../../utilities/style/colors';
import { themeBehavior } from '../../utilities/style/theme';

export const linkStyles = css`
    ${display('inline-flex')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
    }

    .control {
        display: inline;
        color: var(--ni-private-link-font-color);
        cursor: default;
    }

    .control:any-link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control:active {
        color: var(--ni-private-link-active-font-color);
        text-decoration: underline;
    }

    .control:not(:any-link) {
        --ni-private-link-font-color: ${bodyDisabledFontColor};
        text-decoration: none;
    }

    .control:not(:any-link):active {
        --ni-private-link-active-font-color: ${bodyDisabledFontColor};
    }
`;

export const linkColors = css`
    :host {
        --ni-private-link-font-color: ${bodyFontColor};
        --ni-private-link-active-font-color: ${bodyFontColor};
    }
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            :host {
                --ni-private-link-active-font-color: ${DigitalGreenDark};
            }

            :host([appearance='prominent']) {
                --ni-private-link-font-color: ${DigitalGreenDark};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                --ni-private-link-active-font-color: ${PowerGreen};
            }

            :host([appearance='prominent']) {
                --ni-private-link-font-color: ${PowerGreen};
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

            :host([appearance='prominent']) {
                --ni-private-link-font-color: ${PowerGreen};
            }
        `
    )
);

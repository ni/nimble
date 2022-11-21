import { css } from '@microsoft/fast-element';
import {
    DigitalGreenDark,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { appearanceBehavior } from '../utilities/style/appearance';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { focusVisible } from '../utilities/style/focus';
import { themeBehavior } from '../utilities/style/theme';
import { styles as linkStyles } from '../patterns/link/styles';
import { primaryButtonStyles, styles as buttonStyles } from '../patterns/button/styles';
import { AnchorAppearance } from './types';

export const styles = css`
    :host([disabled]) .control {
        --ni-private-link-font-color: ${bodyDisabledFontColor};
        pointer-events: none;
        cursor: default;
    }
`.withBehaviors(
    appearanceBehavior([
            AnchorAppearance.outline,
            AnchorAppearance.ghost,
            AnchorAppearance.block
        ],
        css`
            ${buttonStyles}
            ${primaryButtonStyles}

            .control {
                text-decoration: none;
            }
        `),
    appearanceBehavior([
            AnchorAppearance.text,
            AnchorAppearance.inlineText
        ],
        css`
        ${linkStyles}

        :host {
            box-sizing: border-box;
            font: ${bodyFont};
            --ni-private-link-font-color: ${bodyFontColor};
        }

        .control {
            height: fit-content;
            align-self: center;
        }

        :host([disabled]) .control {
            color: ${bodyDisabledFontColor};
            pointer-events: none;
            cursor: default;
        }

        .control:any-link${focusVisible} {
            text-decoration: underline;
            box-shadow: inset 0px -1px var(--ni-private-link-font-color);
        }

        `.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                    :host {
                        --ni-private-link-active-font-color: ${DigitalGreenDark};
                    }

                    :host([appearance-variant='prominent']) {
                        --ni-private-link-font-color: var(--ni-private-link-active-font-color);
                    }
                `
            ),
            themeBehavior(
                Theme.dark,
                css`
                    :host {
                        --ni-private-link-active-font-color: ${PowerGreen};
                    }

                    :host([appearance-variant='prominent']) {
                        --ni-private-link-font-color: var(--ni-private-link-active-font-color);
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

                    :host([appearance-variant='prominent']) {
                        --ni-private-link-font-color: var(--ni-private-link-active-font-color);
                    }
                `
            )
        )),
    appearanceBehavior(
        AnchorAppearance.inlineText,
        css`

        :host {
            height: auto
        }

        .control {
            display: inline;
        }

        .control:any-link {
            text-decoration: underline;
        }
        `
    )
);

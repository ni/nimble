import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    DigitalGreenDark,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    bodyEmphasizedFont,
    bodyFont,
    bodyFontColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        --ni-private-breadcrumb-link-font-color: ${bodyFontColor};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }

    :host(.prominent-links) {
        --ni-private-breadcrumb-link-active-font-color: ${bodyFontColor};
    }

    ::slotted(*:first-child) {
        padding-left: 0px;
    }

    ::slotted(*:not([href]):last-child) {
        font: ${bodyEmphasizedFont};
    }
`.withBehaviors(
        themeBehavior(
            Theme.light,
            css`
            :host {
                --ni-private-breadcrumb-link-active-font-color: ${DigitalGreenDark};
            }

            :host(.prominent-links) {
                --ni-private-breadcrumb-link-font-color: ${DigitalGreenDark};
            }
        `
        ),
        themeBehavior(
            Theme.dark,
            css`
            :host {
                --ni-private-breadcrumb-link-active-font-color: ${PowerGreen};
            }

            :host(.prominent-links) {
                --ni-private-breadcrumb-link-font-color: ${PowerGreen};
            }
        `
        ),
        themeBehavior(
            Theme.color,
            css`
            :host {
                --ni-private-breadcrumb-link-active-font-color: ${hexToRgbaCssColor(
                White,
                0.6
            )};
            }

            :host(.prominent-links) {
                --ni-private-breadcrumb-link-font-color: ${PowerGreen};
            }
        `
        )
    );

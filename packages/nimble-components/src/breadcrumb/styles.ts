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

    :host([appearance="prominent"]) {
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
            css`
            ${'' /* Light theme */}
            :host {
                --ni-private-breadcrumb-link-active-font-color: ${DigitalGreenDark};
            }

            :host([appearance="prominent"]) {
                --ni-private-breadcrumb-link-font-color: ${DigitalGreenDark};
            }
        `,
            css`
            ${'' /* Dark theme */}
            :host {
                --ni-private-breadcrumb-link-active-font-color: ${PowerGreen};
            }

            :host([appearance="prominent"]) {
                --ni-private-breadcrumb-link-font-color: ${PowerGreen};
            }
        `,
            css`
            ${'' /* Color theme */}
            :host {
                --ni-private-breadcrumb-link-active-font-color: ${hexToRgbaCssColor(
                White,
                0.6
            )};
            }

            :host([appearance="prominent"]) {
                --ni-private-breadcrumb-link-font-color: ${PowerGreen};
            }
        `
        )
    );

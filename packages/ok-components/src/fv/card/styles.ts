import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    bodyPlus1EmphasizedFont,
    bodyPlus1EmphasizedFontColor,
    borderHoverColor,
    cardBorderColor,
    controlHeight,
    mediumPadding,
    sectionBackgroundColor,
    smallPadding,
    smallDelay,
    standardPadding,
    subtitleFont,
    subtitleFontColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { appearanceBehavior } from '@ni/nimble-components/dist/esm/utilities/style/appearance';
import { display } from '../../utilities/style/display';
import { FvCardAppearance } from './types';

export const styles = css`
    ${display('block')}

    :host {
        display: block;
    }

    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('block')}

        :host {
            display: block;
        }

        .card-shell {
            display: grid;
            width: 100%;
            height: 100%;
            min-height: inherit;
            box-sizing: border-box;
            padding: ${standardPadding};
            border-radius: 8px;
        }

        .card-button-shell {
            overflow: clip;
            transition:
                background-color ${smallDelay} ease-in-out,
                border-color ${smallDelay} ease-in-out,
                box-shadow ${smallDelay} ease-in-out;
            --ni-private-card-button-background-hover-color: transparent;
            --ni-private-card-button-background-active-color: transparent;
            --ni-private-card-button-border-active-color: transparent;
            --ni-private-card-button-border-selected-color: transparent;
        }

        .card-button-shell::part(control) {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }

        .card-shell > .card-layout,
        .card-shell > .card-button-content,
        .card-button-content > .card-layout {
            height: 100%;
        }

        .card-button-content {
            flex: 1 1 auto;
        }

        .card-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            align-items: start;
            min-height: 100%;
        }

        .card-layout.has-media {
            grid-template-columns: auto minmax(0, 1fr);
            column-gap: ${standardPadding};
        }

        .media-region {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            align-self: start;
            min-width: calc(${controlHeight} + ${mediumPadding});
        }

        .media-region slot[name='icon'] {
            display: block;
        }

        .initials-tile {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.06);
            color: ${bodyPlus1EmphasizedFontColor};
            font: ${bodyPlus1EmphasizedFont};
            text-transform: uppercase;
        }

        .main-region {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: ${mediumPadding};
            text-align: left;
            align-self: stretch;
        }

        .header-row {
            display: flex;
            gap: ${mediumPadding};
            align-items: flex-start;
            justify-content: space-between;
            min-width: 0;
        }

        .title-group,
        .body,
        .footer,
        .actions {
            min-width: 0;
        }

        .title-group {
            display: grid;
            gap: 2px;
        }

        .title {
            font: ${bodyPlus1EmphasizedFont};
            color: ${bodyPlus1EmphasizedFontColor};
        }

        .subtitle {
            font: ${subtitleFont};
            color: ${subtitleFontColor};
        }

        .badges {
            display: inline-flex;
            gap: ${smallPadding};
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            text-align: right;
        }

        .body {
            display: grid;
            gap: ${smallPadding};
            color: ${bodyFontColor};
            font: ${bodyFont};
            text-align: left;
        }

        .description {
            font: ${bodyFont};
            color: ${bodyFontColor};
            text-align: left;
        }

        .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: ${mediumPadding};
            margin-top: auto;
            font: ${tooltipCaptionFont};
            color: ${tooltipCaptionFontColor};
            text-transform: uppercase;
        }

        .footer-start,
        .footer-end {
            min-width: 0;
        }

        .footer-end {
            text-align: right;
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: ${smallPadding};
            flex-wrap: wrap;
        }

        ::slotted([slot='icon']) {
            display: block;
        }

        ::slotted([slot='badges']) {
            max-width: 100%;
        }

        ::slotted([slot='footer-start']),
        ::slotted([slot='footer-end']) {
            display: block;
            max-width: 100%;
        }

        .actions ::slotted(*) {
            flex: 0 0 auto;
        }
    }

    @layer hover {
        .card-button-shell:hover {
            box-shadow: 0 0 0 2px ${borderHoverColor};
        }
    }

    @layer focusVisible {}

    @layer active {
        .card-button-shell:active {
            box-shadow: none;
            border-color: ${borderHoverColor};
        }
    }

    @layer disabled {
        .card-button-shell[disabled] {
            box-shadow: none;
        }
    }

    @layer top {}
`
.withBehaviors(
    appearanceBehavior(
        FvCardAppearance.outline,
        css`
            @layer base {
                .card-shell {
                    border: 2px solid ${cardBorderColor};
                }
            }

            @layer hover {
                .card-button-shell:hover {
                    border-color: transparent;
                }
            }

            @layer active {
                .card-button-shell:hover:active {
                    border-color: ${borderHoverColor};
                }
            }
        `
    ),
    appearanceBehavior(
        FvCardAppearance.block,
        css`
            @layer base {
                .card-shell {
                    background-color: ${sectionBackgroundColor};
                    border: 2px solid transparent;
                }
            }
        `
    )
);

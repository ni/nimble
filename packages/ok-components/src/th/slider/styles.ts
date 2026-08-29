import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    elevation2BoxShadow,
    fillSelectedColor,
    popupBorderColor,
    smallDelay,
    smallPadding,
    tooltipCaptionFont,
    tooltipCaptionFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    Black15,
    Black75,
    Black91,
    DigitalGreenLight,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { hexToRgbaCssColor } from '@ni/nimble-components/dist/esm/utilities/style/colors';
import { focusVisible } from '@ni/nimble-components/dist/esm/utilities/style/focus';
import { themeBehavior } from '@ni/nimble-components/dist/esm/utilities/style/theme';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-block')}

        :host {
            width: 240px;
            height: 32px;
            outline: none;
            color: ${bodyFontColor};
            font: ${bodyFont};
            cursor: pointer;
            touch-action: none;
        }

        :host([orientation='vertical']) {
            width: 32px;
            height: 240px;
        }

        :host([readonly]) {
            cursor: default;
        }

        .positioning-region {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
        }

        .track {
            position: relative;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background-color: var(--ni-private-slider-track-background-color);
        }

        .track-start {
            position: absolute;
            inset-block: 0;
            left: 0;
            border-radius: inherit;
            background-color: ${fillSelectedColor};
        }

        .thumb-container {
            position: absolute;
            top: 50%;
            display: flex;
            width: 24px;
            height: 24px;
            align-items: center;
            justify-content: center;
            border: ${borderWidth} solid
                var(--ni-private-slider-thumb-border-selected-color);
            border-radius: 50%;
            background-color: var(
                --ni-private-slider-thumb-background-color
            );
            transform: translate(50%, -50%);
            transition: border-color ${smallDelay} ease-in-out;
        }

        .thumb-container::after {
            content: '';
            width: 18px;
            height: 18px;
            border-radius: 50%;
            opacity: 0;
        }

        .value-label {
            position: absolute;
            inset-block-end: calc(100% + ${smallPadding});
            display: none;
            padding: ${smallPadding};
            border: ${borderWidth} solid ${popupBorderColor};
            background-color: ${applicationBackgroundColor};
            box-shadow: ${elevation2BoxShadow};
            color: ${tooltipCaptionFontColor};
            font: ${tooltipCaptionFont};
            line-height: 1;
            white-space: nowrap;
            pointer-events: none;
        }

        :host([value-visible]) .value-label {
            display: block;
        }

        :host([orientation='vertical']) .positioning-region {
            align-items: initial;
        }

        :host([orientation='vertical']) .track {
            width: 4px;
            height: 100%;
        }

        :host([orientation='vertical']) .track-start {
            inset-block-start: 0;
            inset-inline: 0;
        }

        :host([orientation='vertical']) .thumb-container {
            top: auto;
            left: 50%;
            transform: translate(-50%, 50%);
        }

        :host([orientation='vertical']) .value-label {
            inset-block-end: auto;
            inset-inline-start: calc(100% + ${smallPadding});
        }

        ::slotted(*) {
            color: ${bodyFontColor};
            font: ${bodyFont};
        }
    }

    @layer hover {
        :host(:not([disabled]):not([readonly]):hover) .thumb-container {
            border: calc(${borderWidth} * 2) solid ${borderHoverColor};
        }
    }

    @layer focusVisible {
        :host(${focusVisible}) .thumb-container {
            border: calc(${borderWidth} * 2) solid ${borderHoverColor};
        }

        :host(${focusVisible}) .thumb-container::after {
            border: ${borderWidth} solid
                var(--ni-private-slider-thumb-border-selected-color);
            background-color: var(
                --ni-private-slider-thumb-background-color
            );
            opacity: 1;
        }
    }

    @layer active {
        :host(:not([disabled]):not([readonly]):active)
            .thumb-container::after {
            background-color: var(
                --ni-private-slider-thumb-background-active-color
            );
            opacity: 1;
        }
    }

    @layer disabled {
        :host([disabled]) {
            color: ${bodyDisabledFontColor};
            cursor: default;
        }

        :host([disabled]) .track {
            background-color: var(
                --ni-private-slider-track-background-disabled-color
            );
        }

        :host([disabled]) .track-start {
            background-color: var(
                --ni-private-slider-track-background-disabled-color
            );
        }

        :host([disabled]) .thumb-container {
            border: ${borderWidth} solid
                var(--ni-private-slider-thumb-border-disabled-color);
            background-color: transparent;
        }

        :host([disabled]) .thumb-container::after {
            opacity: 0;
        }

        :host([disabled]) ::slotted(*) {
            color: ${bodyDisabledFontColor};
        }
    }

    @layer top {}
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            :host {
                --ni-private-slider-track-background-color: ${hexToRgbaCssColor(
                    Black91,
                    0.1
                )};
                --ni-private-slider-track-background-disabled-color: ${hexToRgbaCssColor(
                    Black91,
                    0.07
                )};
                --ni-private-slider-thumb-background-color: ${White};
                --ni-private-slider-thumb-background-active-color: ${hexToRgbaCssColor(
                    DigitalGreenLight,
                    0.3
                )};
                --ni-private-slider-thumb-border-selected-color: ${DigitalGreenLight};
                --ni-private-slider-thumb-border-disabled-color: ${hexToRgbaCssColor(
                    Black91,
                    0.15
                )};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                --ni-private-slider-track-background-color: ${hexToRgbaCssColor(
                    Black15,
                    0.1
                )};
                --ni-private-slider-track-background-disabled-color: ${hexToRgbaCssColor(
                    Black15,
                    0.07
                )};
                --ni-private-slider-thumb-background-color: ${Black75};
                --ni-private-slider-thumb-background-active-color: ${hexToRgbaCssColor(
                    PowerGreen,
                    0.3
                )};
                --ni-private-slider-thumb-border-selected-color: ${PowerGreen};
                --ni-private-slider-thumb-border-disabled-color: ${hexToRgbaCssColor(
                    Black15,
                    0.15
                )};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                --ni-private-slider-track-background-color: ${hexToRgbaCssColor(
                    White,
                    0.1
                )};
                --ni-private-slider-track-background-disabled-color: ${hexToRgbaCssColor(
                    White,
                    0.07
                )};
                --ni-private-slider-thumb-background-color: ${hexToRgbaCssColor(
                    White,
                    0.3
                )};
                --ni-private-slider-thumb-background-active-color: ${hexToRgbaCssColor(
                    White,
                    0.3
                )};
                --ni-private-slider-thumb-border-selected-color: ${White};
                --ni-private-slider-thumb-border-disabled-color: ${hexToRgbaCssColor(
                    White,
                    0.3
                )};
            }
        `
    )
);

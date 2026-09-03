import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    smallPadding,
    tooltipCaptionFont
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    Black15,
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
            width: 100%;
            /* Three thumb widths allow three non-overlapping slider positions. */
            min-width: 42px;
            height: 32px;
            outline: none;
            color: ${bodyFontColor};
            font: ${bodyFont};
            cursor: pointer;
            touch-action: none;
        }

        :host([orientation='vertical']) {
            width: 32px;
            min-width: 32px;
            height: 100%;
            min-height: 42px;
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
            background-color: var(
                --ni-private-slider-thumb-border-selected-color
            );
        }

        .thumb-container {
            position: absolute;
            top: 50%;
            display: flex;
            width: 14px;
            height: 14px;
            box-sizing: border-box;
            align-items: center;
            justify-content: center;
            border: ${borderWidth} solid
                var(--ni-private-slider-thumb-border-selected-color);
            border-radius: 50%;
            background-color: ${applicationBackgroundColor};
            transform: translate(50%, -50%);
        }

        .thumb-container::after {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            opacity: 0;
        }

        .value-label {
            position: absolute;
            inset-block-end: calc(50% + 7px + ${smallPadding});
            display: none;
            font: ${tooltipCaptionFont};
            line-height: 1;
            white-space: nowrap;
            pointer-events: none;
            transform: translateX(50%);
        }

        :host([value-visible]) .value-label {
            display: block;
        }

        .range-label {
            position: absolute;
            inset-block-start: calc(50% + 7px + ${smallPadding});
            display: none;
            font: ${tooltipCaptionFont};
            line-height: 1;
            white-space: nowrap;
            pointer-events: none;
        }

        .minimum-label {
            inset-inline-start: 0;
            transform: translateX(-50%);
        }

        .maximum-label {
            inset-inline-end: 0;
            transform: translateX(50%);
        }

        :host([show-min-max='always']) .range-label {
            display: block;
        }

        :host(:not([show-min-max]):hover) .range-label,
        :host(:not([show-min-max]):active) .range-label,
        :host([show-min-max='hover']:hover) .range-label,
        :host([show-min-max='hover']:active) .range-label {
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
            inset-block-start: auto;
            inset-block-end: 0;
            inset-inline: 0;
        }

        :host([orientation='vertical']) .thumb-container {
            top: auto;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        :host([orientation='vertical']) .value-label {
            inset-block-end: auto;
            inset-inline-start: calc(50% + 7px + ${smallPadding});
            transform: translateY(-50%);
        }

        :host([orientation='vertical']) .range-label {
            inset-inline-start: auto;
            inset-inline-end: calc(50% + 7px + ${smallPadding});
        }

        :host([orientation='vertical']) .minimum-label {
            inset-block: auto 0;
            transform: translateY(50%);
        }

        :host([orientation='vertical']) .maximum-label {
            inset-block: 0 auto;
            transform: translateY(-50%);
        }

        ::slotted(*) {
            color: ${bodyFontColor};
            font: ${bodyFont};
        }
    }

    @layer hover {
        :host(:hover) .thumb-container {
            border: calc(${borderWidth} * 2) solid ${borderHoverColor};
        }

        :host([readonly]:hover) .thumb-container {
            border: ${borderWidth} solid
                var(--ni-private-slider-thumb-border-selected-color);
        }

        :host([disabled]:hover) .thumb-container {
            border: ${borderWidth} solid
                var(--ni-private-slider-thumb-border-disabled-color);
        }
    }

    @layer focusVisible {
        :host(${focusVisible}) .thumb-container {
            border: calc(${borderWidth} * 2) solid ${borderHoverColor};
        }

        :host(${focusVisible}) .thumb-container::after {
            background-color: ${fillSelectedColor};
            opacity: 1;
        }
    }

    @layer active {
        :host(:active) .thumb-container {
            border-width: calc(${borderWidth} * 2);
        }

        :host(:active) .thumb-container::after {
            background-color: var(
                --ni-private-slider-thumb-background-active-color
            );
            opacity: 1;
        }

        :host([readonly]:active) .thumb-container {
            border-width: ${borderWidth};
        }

        :host([readonly]:active) .thumb-container::after,
        :host([disabled]:active) .thumb-container::after {
            opacity: 0;
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
            background-color: ${applicationBackgroundColor};
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

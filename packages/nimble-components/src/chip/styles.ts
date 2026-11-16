import { css } from '@ni/fast-element';
import {
    actionRgbPartialColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    fillSelectedColor,
    fillSelectedRgbPartialColor,
    iconColor,
    iconSize,
    mediumPadding,
    smallPadding
} from '../theme-provider/design-tokens';
import { display } from '../utilities/style/display';
import { appearanceBehavior } from '../utilities/style/appearance';
import { focusVisible } from '../utilities/style/focus';
import { ChipAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        :host {
            position: relative;
            height: ${controlHeight};
            width: fit-content;
            max-width: 300px;
            color: ${bodyFontColor};
            font: ${bodyFont};
            padding: 0 ${mediumPadding};
            gap: 4px;
            background-color: transparent;
            border: ${borderWidth} solid rgba(${actionRgbPartialColor}, 0.3);
            border-radius: 4px;
            justify-content: center;
            align-items: center;
            box-shadow: none;
            outline: none;
            outline-offset: 0;
        }

        :host([selectable]) {
            cursor: pointer;
            padding: 0;
        }

        :host([selectable]:not([selected]):not([appearance='block'])) {
            border-color: rgba(${borderRgbPartialColor}, 0.3);
        }

        :host([selectable][selected]) {
            background-color: ${fillSelectedColor};
            border-color: rgba(${actionRgbPartialColor}, 0.3);
        }

        .toggle-button {
            height: 100%;
            min-width: 0;
            max-width: 100%;
            color: inherit;
            font: inherit;
        }

        .toggle-button::part(control) {
            /* Anchor the focus overlay to the chip, not the inner control. */
            position: static;
            padding: 0 ${mediumPadding};
            border-color: transparent;
            border-radius: 2px;
            box-shadow: none;
            background-image: none;
            background-color: transparent;
        }

        .toggle-button::part(control)::before {
            outline: none;
        }

        slot[name='start']::slotted(*) {
            flex-shrink: 0;
        }

        [part='start'] {
            display: contents;
            ${iconColor.cssCustomProperty}: ${bodyFontColor};
        }

        .content {
            min-width: 0;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .remove-button {
            height: ${iconSize};
            width: ${iconSize};
            margin-right: calc(-1 * ${smallPadding});
        }

        [part='end'] {
            display: none;
        }
    }

    @layer hover {
        :host([selectable]:hover:not([disabled])) {
            border-color: ${borderHoverColor};
            outline: calc(${borderWidth} * 2) solid ${borderHoverColor};
            outline-offset: calc(-2 * ${borderWidth});
            box-shadow: none;
        }
    }

    @layer focusVisible {
        :host(:not([disabled]))
            .toggle-button::part(control)${focusVisible}::before {
            inset: calc(${borderWidth} * 2);
            width: auto;
            height: auto;
            border: ${borderWidth} solid ${borderHoverColor};
            border-radius: 0;
        }

        :host(:not([disabled]))
            .toggle-button::part(control)${focusVisible}::after {
            content: '';
            position: absolute;
            inset: calc(-1 * ${borderWidth});
            border: calc(${borderWidth} * 2) solid ${borderHoverColor};
            border-radius: 4px;
            pointer-events: none;
        }
    }

    @layer active {
        :host(
            [selectable]:active:not([disabled]):not(
                    [remove-button-active]
                )
        ) {
            background-color: transparent;
            border-color: ${borderHoverColor};
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: calc(-1 * ${borderWidth});
            box-shadow: none;
        }

        :host(
            [selectable]:active:not([disabled]):not(
                    [remove-button-active]
                )
        )::before {
            content: '';
            position: absolute;
            inset: ${borderWidth};
            border-radius: 2px;
            background-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
            pointer-events: none;
        }
    }

    @layer disabled {
        :host([disabled]) {
            cursor: default;
            color: ${bodyDisabledFontColor};
            box-shadow: none;
        }

        :host([disabled]:not([appearance='block'])) {
            border-color: rgba(${borderRgbPartialColor}, 0.3);
            background-color: transparent;
        }

        :host([disabled][appearance='block']) {
            border-color: transparent;
        }

        :host([disabled]) slot[name='start']::slotted(*) {
            opacity: 0.3;
            ${iconColor.cssCustomProperty}: ${bodyFontColor};
        }
    }
`.withBehaviors(
    appearanceBehavior(
        ChipAppearance.block,
        css`
            @layer base {
                :host {
                    background-color: rgba(${borderRgbPartialColor}, 0.1);
                    border-color: transparent;
                }
            }

            @layer disabled {
                :host([disabled]) {
                    background-color: rgba(${borderRgbPartialColor}, 0.1);
                }
            }
        `
    )
);

import { css } from '@ni/fast-element';
import {
    actionRgbPartialColor,
    applicationBackgroundColor,
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
import { focusVisible } from '../utilities/style/focus';
import { appearanceBehavior } from '../utilities/style/appearance';
import { ChipAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        :host {
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

        :host([selection-mode='single']) {
            cursor: pointer;
        }

        :host(
            [selection-mode='single']:not([selected]):not([appearance='block'])
        ) {
            border-color: rgba(${borderRgbPartialColor}, 0.3);
        }

        :host([selected]) {
            background-color: ${fillSelectedColor};
            border-color: rgba(${actionRgbPartialColor}, 0.3);
        }

        slot[name='start']::slotted(*) {
            flex-shrink: 0;
        }

        [part='start'] {
            display: contents;
            ${iconColor.cssCustomProperty}: ${bodyFontColor};
        }

        .content {
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
        :host([selection-mode='single']:hover:not([disabled])) {
            border-color: ${borderHoverColor};
            outline: calc(${borderWidth} * 2) solid ${borderHoverColor};
            outline-offset: calc(-2 * ${borderWidth});
            box-shadow: none;
        }
    }

    @layer focusVisible {
        :host([selection-mode='single']${focusVisible}:not([disabled])) {
            border-color: ${borderHoverColor};
            outline: calc(${borderWidth} * 2) solid ${borderHoverColor};
            outline-offset: calc(-2 * ${borderWidth});
            box-shadow:
                0 0 0 calc(${borderWidth} * 2) ${applicationBackgroundColor}
                    inset,
                0 0 0 calc(${borderWidth} * 3) ${borderHoverColor} inset;
        }
    }

    @layer active {
        :host(
            [selection-mode='single']:active:not([disabled]):not(
                    [remove-button-active]
                )
        ) {
            background-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
            border-color: ${borderHoverColor};
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: calc(-1 * ${borderWidth});
            box-shadow: 0 0 0 ${borderWidth} ${applicationBackgroundColor} inset;
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

import { css } from '@ni/fast-element';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    iconColor,
    iconSize,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled;

    @layer base {
        ${display('inline-flex')}

        :host {
            position: relative;
            max-width: 100%;
            color: var(--ok-fv-expandable-chip-color, ${bodyFontColor});
            font: ${bodyFont};
        }

        .expandable-chip {
            display: inline-flex;
            align-items: center;
            gap: ${smallPadding};
            max-width: 100%;
            height: 24px;
            min-height: 24px;
            padding: 0 ${standardPadding};
            border: ${borderWidth} solid var(--ok-fv-expandable-chip-border, transparent);
            border-radius: 4px;
            background: var(--ok-fv-expandable-chip-background, rgba(${borderRgbPartialColor}, 0.1));
            color: inherit;
            font: inherit;
            text-align: start;
            cursor: pointer;
            box-sizing: border-box;
        }

        .label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .expand-icon {
            flex: 0 0 auto;
            ${iconColor.cssCustomProperty}: currentColor;
        }

        .remove-button {
            position: absolute;
            inset-inline-start: calc(${borderWidth} + ${smallPadding});
            top: 50%;
            width: ${iconSize};
            height: ${iconSize};
            transform: translateY(-50%);
        }

        /* Extend the pointer target without enlarging the visible Nimble button. */
        .remove-button::part(control)::after {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        :host([removable]:not([disabled])) .expandable-chip {
            padding-inline: calc(${iconSize} + 2 * ${smallPadding}) ${smallPadding};
        }

        :host([removable]:not([disabled])) :is(.expand-icon, .remove-button) {
            visibility: hidden;
        }

        :host([removable]:not([disabled]):hover) :is(.expand-icon, .remove-button),
        :host([removable]:not([disabled]):focus-within) :is(.expand-icon, .remove-button) {
            visibility: visible;
        }
    }

    @layer hover {
        .expandable-chip:hover:not(:disabled) {
            border-color: var(--ok-fv-expandable-chip-border, ${borderHoverColor});
            background: var(--ok-fv-expandable-chip-background, rgba(${borderRgbPartialColor}, 0.16));
        }
    }

    @layer focusVisible {
        .expandable-chip:focus-visible {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: 2px;
        }
    }

    @layer active {
        .expandable-chip:active:not(:disabled) {
            background: var(--ok-fv-expandable-chip-background, rgba(${borderRgbPartialColor}, 0.2));
        }
    }

    @layer disabled {
        .expandable-chip:disabled {
            color: ${bodyDisabledFontColor};
            cursor: not-allowed;
        }
    }
`;

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    borderWidth,
    controlHeight,
    controlSlimHeight,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    mediumDelay,
    smallPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';
import { Theme } from '../../../theme-provider/types';
import { hexToRgbaCssColor } from '../../../utilities/style/colors';
import { themeBehavior } from '../../../utilities/style/theme';

export const styles = css`
    ${display('flex')}

    :host {
        width: fit-content;
        min-width: 100%;
        background-color: ${applicationBackgroundColor};
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid transparent;
        box-sizing: border-box;
        background-clip: padding-box;
    }

    :host::before {
        content: '';
        width: 100%;
        height: ${controlHeight};
        pointer-events: none;
        box-sizing: border-box;
        bottom: 0px;
        position: absolute;
    }

    :host([selectable]:not([selected]):hover)::before {
        background-color: ${fillHoverColor};
    }

    :host([selected])::before {
        background-color: ${fillSelectedColor};
    }

    :host([selected]:hover)::before {
        background-color: ${fillHoverSelectedColor};
    }

    :host([expanded]) .animating,
    :host .animating {
        transition: ${mediumDelay} ease-in-out;
    }

    .expand-collapse-button {
        margin-left: calc(
            ${smallPadding} * 2 + ${standardPadding} * 2 *
                var(--ni-private-table-row-indent-level)
        );
        height: ${controlSlimHeight};
        align-self: center;
    }

    :host([expanded]) .expander-icon {
        transform: rotate(90deg);
    }

    .expander-icon {
        transform: rotate(0deg);
    }

    .row-operations-container {
        display: flex;
    }

    .selection-checkbox {
        margin-left: ${standardPadding};
    }

    .selection-checkbox::part(label) {
        padding-left: 0px;
    }

    .row-front-spacer {
        width: ${controlHeight};
        flex: 0 0 auto;
    }

    .cell-container {
        display: grid;
        width: 100%;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
    }

    @media (prefers-reduced-motion) {
        :host .animating,
        :host([expanded]) .animating {
            transition-duration: 0s;
        }
    }

    nimble-table-cell {
        --ni-private-table-cell-action-menu-display: none;
    }

    nimble-table-cell[menu-open] {
        --ni-private-table-cell-action-menu-display: block;
    }

    :host(:hover) nimble-table-cell {
        --ni-private-table-cell-action-menu-display: block;
    }

    :host([selected]) nimble-table-cell {
        --ni-private-table-cell-action-menu-display: block;
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            :host([selectable]:not([selected]):hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.05)};
            }

            :host([selected])::before {
                background-color: ${hexToRgbaCssColor(White, 0.25)};
            }

            :host([selected]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.2)};
            }
        `
    )
);

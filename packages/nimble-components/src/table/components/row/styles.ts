import { css } from '@microsoft/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '../../../utilities/style/display';
import {
    applicationBackgroundColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    controlSlimHeight,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    mediumPadding,
    smallPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';
import { Theme } from '../../../theme-provider/types';
import { hexToRgbaCssColor } from '../../../utilities/style/colors';
import { themeBehavior } from '../../../utilities/style/theme';
import { styles as expandCollapseStyles } from '../../../patterns/expand-collapse/styles';
import { focusVisible } from '../../../utilities/style/focus';

export const styles = css`
    ${display('flex')}
    ${expandCollapseStyles}

    :host {
        width: fit-content;
        min-width: 100%;
        background-color: ${applicationBackgroundColor};
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid transparent;
        background-clip: padding-box;
    }

    :host::before {
        content: '';
        width: 100%;
        height: ${controlHeight};
        pointer-events: none;
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

    :host(${focusVisible}) {
        outline: calc(2 * ${borderWidth}) solid ${borderHoverColor};
        outline-offset: calc(-2 * ${borderWidth});
    }

    .expand-collapse-button {
        flex: 0 0 auto;
        margin-left: max(
            calc(
                ${mediumPadding} +
                    (var(--ni-private-table-row-indent-level) - 1) *
                    ${controlHeight}
            ),
            0px
        );
    }

    .spinner-container {
        flex: 0 0 auto;
        width: ${controlSlimHeight};
        height: ${controlSlimHeight};
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: max(
            calc(
                ${mediumPadding} +
                    (var(--ni-private-table-row-indent-level) - 1) *
                    ${controlHeight}
            ),
            0px
        );
    }

    .row-operations-container {
        flex: 0 0 auto;
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

    .row-front-spacer.top-level-parent {
        width: ${mediumPadding};
    }

    .cell-container {
        display: grid;
        width: 100%;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
    }

    .cell-container.nested-parent {
        margin-left: calc(
            (${controlHeight} * var(--ni-private-table-row-indent-level)) * -1
        );
    }

    nimble-table-cell {
        --ni-private-table-cell-action-menu-display: none;
    }

    nimble-table-cell[menu-open] {
        --ni-private-table-cell-action-menu-display: block;
    }

    nimble-table-cell${focusVisible} {
        --ni-private-table-cell-action-menu-display: block;
    }

    nimble-table-cell:first-of-type${focusVisible} {
        margin-left: calc(
            -1 * (${controlHeight} - ${smallPadding}) * var(--ni-private-table-cell-focus-offset-multiplier)
        );
        padding-left: calc(
            (${controlHeight} - ${mediumPadding}) *
                var(--ni-private-table-cell-focus-offset-multiplier) +
                ${mediumPadding}
        );
    }

    nimble-table-cell:first-of-type${focusVisible}::before {
        content: '';
        display: block;
        width: calc(
            (
                    ${controlHeight} *
                        var(--ni-private-table-cell-nesting-level) +
                        ${smallPadding}
                ) * var(--ni-private-table-cell-focus-offset-multiplier)
        );
        height: ${controlHeight};
        box-sizing: border-box;
    }

    :host(:hover) nimble-table-cell {
        --ni-private-table-cell-action-menu-display: block;
    }

    :host([selected]) nimble-table-cell {
        --ni-private-table-cell-action-menu-display: block;
    }

    :host(${focusVisible}) nimble-table-cell {
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

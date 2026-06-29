import { css } from '@ni/fast-element';
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
    standardPadding,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';
import { Theme } from '../../../theme-provider/types';
import { hexToRgbaCssColor } from '../../../utilities/style/colors';
import { themeBehavior } from '../../../utilities/style/theme';
import { styles as expandCollapseStyles } from '../../../patterns/expand-collapse/styles';
import { focusVisible } from '../../../utilities/style/focus';
import { ZIndexLevels } from '../../../utilities/style/types';

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

    :host([selectable][allow-hover]:hover)::before {
        background-color: ${fillHoverColor};
    }

    :host([selected])::before {
        background-color: ${fillSelectedColor};
    }

    :host([selected][allow-hover]:hover)::before {
        background-color: ${fillHoverSelectedColor};
    }

    :host(${focusVisible}) {
        outline: none;
        box-shadow:
            inset calc(2 * ${borderWidth}) calc(2 * ${borderWidth})
                ${borderHoverColor},
            inset calc(-2 * ${borderWidth}) calc(-2 * ${borderWidth})
                ${borderHoverColor};
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

    .row-front-spacer.reduced-size-spacer {
        width: ${mediumPadding};
    }

    .pinned-cell-container {
        display: grid;
        grid-template-columns: var(--ni-private-table-pinned-columns-row-grid-columns);
        position: sticky;
        left: 0;
        background: ${applicationBackgroundColor};
        z-index: ${ZIndexLevels.zIndex1};
        box-shadow: inset -2px 0 0 0 ${tableRowBorderColor};
    }

    :host([selectable][allow-hover]:hover) .pinned-cell-container {
        background: linear-gradient(${fillHoverColor}, ${fillHoverColor}),
            ${applicationBackgroundColor};
    }

    :host([selected]) .pinned-cell-container {
        background: linear-gradient(${fillSelectedColor}, ${fillSelectedColor}),
            ${applicationBackgroundColor};
    }

    :host([selected][allow-hover]:hover) .pinned-cell-container {
        background: linear-gradient(
                ${fillHoverSelectedColor},
                ${fillHoverSelectedColor}
            ),
            ${applicationBackgroundColor};
    }

    :host(${focusVisible}) .pinned-cell-container {
        box-shadow:
            inset calc(2 * ${borderWidth}) 0 0 ${borderHoverColor},
            inset 0 calc(2 * ${borderWidth}) 0 ${borderHoverColor},
            inset 0 calc(-2 * ${borderWidth}) 0 ${borderHoverColor},
            inset -2px 0 0 0 ${tableRowBorderColor};
    }
    ${'' /* Pushing the pinned-cell-container to a higher z-index for breakpoint menu behavior (not required by table directly) */}
    :host([menu-open]) .pinned-cell-container {
        z-index: ${ZIndexLevels.zIndex1000};
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
            -1 * (${controlHeight} - ${smallPadding}) *
                var(--ni-private-table-cell-focus-offset-multiplier)
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
                ) *
                var(--ni-private-table-cell-focus-offset-multiplier)
        );
        height: ${controlHeight};
    }

    :host([allow-hover]:hover) nimble-table-cell {
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
            :host([selectable]:not([selected])[allow-hover]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.05)};
            }

            :host([selected])::before {
                background-color: ${hexToRgbaCssColor(White, 0.25)};
            }

            :host([selected][allow-hover]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.2)};
            }

            .pinned-cell-container {
                box-shadow: inset -2px 0 0 0 ${hexToRgbaCssColor(White, 0.1)};
            }

            :host([selectable][allow-hover]:hover) .pinned-cell-container {
                background: linear-gradient(
                        ${hexToRgbaCssColor(White, 0.05)},
                        ${hexToRgbaCssColor(White, 0.05)}
                    ),
                    ${applicationBackgroundColor};
            }

            :host([selected]) .pinned-cell-container {
                background: linear-gradient(
                        ${hexToRgbaCssColor(White, 0.25)},
                        ${hexToRgbaCssColor(White, 0.25)}
                    ),
                    ${applicationBackgroundColor};
            }

            :host([selected][allow-hover]:hover) .pinned-cell-container {
                background: linear-gradient(
                        ${hexToRgbaCssColor(White, 0.2)},
                        ${hexToRgbaCssColor(White, 0.2)}
                    ),
                    ${applicationBackgroundColor};
            }

            :host(${focusVisible}) .pinned-cell-container {
                box-shadow:
                    inset calc(2 * ${borderWidth}) 0 0 ${borderHoverColor},
                    inset 0 calc(2 * ${borderWidth}) 0 ${borderHoverColor},
                    inset 0 calc(-2 * ${borderWidth}) 0 ${borderHoverColor},
                    inset -2px 0 0 0 ${hexToRgbaCssColor(White, 0.1)};
            }
        `
    )
);

import { css } from '@ni/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '../../../utilities/style/display';
import {
    applicationBackgroundColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    fillHoverColor,
    mediumPadding,
    standardPadding,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';
import { Theme } from '../../../theme-provider/types';
import { hexToRgbaCssColor } from '../../../utilities/style/colors';
import { themeBehavior } from '../../../utilities/style/theme';
import { userSelectNone } from '../../../utilities/style/user-select';
import { styles as expandCollapseStyles } from '../../../patterns/expand-collapse/styles';
import { focusVisible } from '../../../utilities/style/focus';
import { ZIndexLevels } from '../../../utilities/style/types';

export const styles = css`
    ${display('grid')}
    ${expandCollapseStyles}

    :host {
        align-items: center;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid ${applicationBackgroundColor};
        grid-template-columns:
            calc(var(--ni-private-table-group-row-pinned-column-offset))
            calc(
                ${controlHeight} *
                    (var(--ni-private-table-group-row-indent-level) + 1)
            )
            1fr;
    }

    :host([selectable]) {
        grid-template-columns:
            calc(var(--ni-private-table-group-row-pinned-column-offset))
            ${controlHeight}
            calc(
                ${controlHeight} *
                    (var(--ni-private-table-group-row-indent-level) + 1)
            )
            1fr;
    }

    :host::before {
        content: '';
        width: 100%;
        height: ${controlHeight};
        pointer-events: none;
        bottom: 0px;
        position: absolute;
    }

    :host([allow-hover]:hover)::before {
        background-color: ${fillHoverColor};
    }

    :host([allow-hover]:hover) .pinned-column-spacer.has-pinned-columns,
    :host([allow-hover]:hover) .checkbox-container.has-pinned-columns {
        background: linear-gradient(${fillHoverColor}, ${fillHoverColor}),
            ${tableRowBorderColor};
    }

    :host(${focusVisible}) {
        outline: calc(2 * ${borderWidth}) solid ${borderHoverColor};
        outline-offset: calc(-2 * ${borderWidth});
    }

    .pinned-column-spacer {
        height: 100%;
    }

    .pinned-column-spacer.has-pinned-columns {
        position: sticky;
        left: 0;
        background: ${tableRowBorderColor};
        z-index: ${ZIndexLevels.zIndex1000};
    }

    .expand-collapse-button {
        margin-left: calc(
            ${mediumPadding} + ${standardPadding} * 2 *
                var(--ni-private-table-group-row-indent-level)
        );
    }

    .group-row-header-content {
        display: flex;
        overflow: hidden;
    }

    .group-header-view {
        padding-left: ${mediumPadding};
        ${userSelectNone}
        overflow: hidden;
    }

    .group-row-child-count {
        padding-left: 2px;
        padding-right: ${mediumPadding};
        pointer-events: none;
        ${userSelectNone}
    }

    .checkbox-container {
        display: flex;
    }

    .checkbox-container.has-pinned-columns {
        position: relative;
        background: ${tableRowBorderColor};
    }

    .selection-checkbox {
        margin-left: ${standardPadding};
    }

    .selection-checkbox::part(label) {
        padding-left: 0px;
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            :host([allow-hover]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.05)};
            }

            :host([allow-hover]:hover) .pinned-column-spacer.has-pinned-columns,
            :host([allow-hover]:hover) .checkbox-container.has-pinned-columns {
                background: linear-gradient(
                        ${hexToRgbaCssColor(White, 0.05)},
                        ${hexToRgbaCssColor(White, 0.05)}
                    ),
                    linear-gradient(
                        ${hexToRgbaCssColor(White, 0.1)},
                        ${hexToRgbaCssColor(White, 0.1)}
                    ),
                    ${tableRowBorderColor};
            }

            .pinned-column-spacer.has-pinned-columns,
            .checkbox-container.has-pinned-columns {
                background: linear-gradient(
                        ${hexToRgbaCssColor(White, 0.1)},
                        ${hexToRgbaCssColor(White, 0.1)}
                    ),
                    ${tableRowBorderColor};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host([allow-hover]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.1)};
            }

            :host([allow-hover]:hover) .pinned-column-spacer.has-pinned-columns,
            :host([allow-hover]:hover) .checkbox-container.has-pinned-columns {
                background: linear-gradient(
                        ${hexToRgbaCssColor(White, 0.1)},
                        ${hexToRgbaCssColor(White, 0.1)}
                    ),
                    ${tableRowBorderColor};
            }
        `
    )
);

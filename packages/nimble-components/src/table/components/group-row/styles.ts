import { css } from '@microsoft/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '../../../utilities/style/display';
import {
    applicationBackgroundColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    fillHoverColor,
    mediumPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';
import { Theme } from '../../../theme-provider/types';
import { hexToRgbaCssColor } from '../../../utilities/style/colors';
import { themeBehavior } from '../../../utilities/style/theme';
import { userSelectNone } from '../../../utilities/style/user-select';
import { styles as expandCollapseStyles } from '../../../patterns/expand-collapse/styles';
import { focusVisible } from '../../../utilities/style/focus';

export const styles = css`
    ${display('grid')}
    ${expandCollapseStyles}

    :host {
        align-items: center;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid ${applicationBackgroundColor};
        grid-template-columns:
            calc(
                ${controlHeight} *
                    (var(--ni-private-table-group-row-indent-level) + 1)
            )
            1fr;
    }

    :host([selectable]) {
        grid-template-columns:
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

    :host([allow-hover-styling]:hover)::before {
        background-color: ${fillHoverColor};
    }

    :host(${focusVisible}) {
        outline: calc(2 * ${borderWidth}) solid ${borderHoverColor};
        outline-offset: calc(-2 * ${borderWidth});
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
            :host([allow-hover-styling]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.05)};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host([allow-hover-styling]:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.1)};
            }
        `
    )
);

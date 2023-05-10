import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    borderWidth,
    controlHeight,
    controlSlimHeight,
    fillHoverColor,
    mediumDelay,
    smallPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';
import { Theme } from '../../../theme-provider/types';
import { hexToRgbaCssColor } from '../../../utilities/style/colors';
import { themeBehavior } from '../../../utilities/style/theme';
import { userSelectNone } from '../../../utilities/style/user-select';

export const styles = css`
    ${display('grid')}

    :host {
        align-items: center;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid ${applicationBackgroundColor};
        box-sizing: border-box;
        grid-template-columns: var(--ni-private-table-group-row-grid-columns) auto;
    }

    :host([expanded]) .animating,
    :host .animating {
        transition: ${mediumDelay} ease-in-out;
    }

    :host::before {
        content: '';
        width: 100%;
        height: ${controlHeight};
        pointer-events: none;
        bottom: 0px;
        position: absolute;
    }

    :host(:hover)::before {
        background-color: ${fillHoverColor};
    }

    .expand-collapse-button {
        margin-left: calc(
            ${smallPadding} * 2 + ${standardPadding} * 2 *
                var(--ni-private-table-group-row-indent-level)
        );
        height: ${controlSlimHeight};
    }

    :host([expanded]) .expander-icon {
        transform: rotate(90deg);
    }

    .expander-icon {
        transform: rotate(0deg);
    }

    .group-row-header-content {
        display: flex;
        overflow: hidden;
    }

    .group-header-view {
        padding-left: calc(${standardPadding} / 2);
        ${userSelectNone}
        overflow: hidden;
        display: flex;
    }

    .group-row-child-count {
        padding-left: 2px;
        padding-right: calc(${standardPadding} / 2);
        pointer-events: none;
        ${userSelectNone}
    }

    @media (prefers-reduced-motion) {
        :host .animating,
        :host([expanded]) .animating {
            transition-duration: 0s;
        }
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
            :host(:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.05)};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host(:hover)::before {
                background-color: ${hexToRgbaCssColor(White, 0.1)};
            }
        `
    )
);

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderWidth,
    controlHeight,
    controlSlimHeight,
    mediumDelay,
    smallPadding,
    standardPadding,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        align-items: center;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid ${tableRowBorderColor};
    }

    :host([expanded]) .animating,
    :host .animating {
        transition: ${mediumDelay} ease-in-out;
    }

    .group-row-container {
        display: flex;
        align-items: center;
        padding-left: calc(
            ${smallPadding} * 2 + ${standardPadding} * 2 *
                var(--ni-private-table-group-row-indent-level)
        );
    }

    .expand-collapse-button {
        margin-left: calc(
            ${smallPadding} * 2 + ${standardPadding} * 2 *
                var(--ni-private-table-group-row-indent-level)
        );
        width: ${controlSlimHeight};
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
        user-select: none;
        overflow: hidden;
        display: flex;
    }

    .group-row-child-count {
        padding-left: 2px;
        pointer-events: none;
        user-select: none;
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
`;

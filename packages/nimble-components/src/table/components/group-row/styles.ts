import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderWidth,
    controlHeight,
    fillHoverColor,
    standardPadding,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        align-items: center;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid ${tableRowBorderColor};
        padding-left: calc(
            ${standardPadding} * 2 *
                var(--ni-private-table-group-row-indent-level)
        );
    }

    :host(:hover) {
        background: ${fillHoverColor};
    }

    :host([expanded='true']) .expander-icon,
    :host([expanded]) .expander-icon {
        transform: rotate(90deg);
    }

    :host([expanded='false']) .expander-icon {
        transform: rotate(0deg);
    }

    :host([expanded='true']) .animating,
    :host([expanded='false']) .animating {
        transition: 0.2s ease-in-out;
    }

    .group-header-value {
        padding-left: calc(${standardPadding} / 2);
        pointer-events: none;
        user-select: none;
    }

    .group-row-child-count {
        padding-left: 2px;
        pointer-events: none;
        user-select: none;
    }

    @media (prefers-reduced-motion) {
        :host([expanded='true']) .animating,
        :host([expanded='false']) .animating {
            transition-duration: 0s;
        }
    }
`;

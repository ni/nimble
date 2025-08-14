import { css } from '@ni/fast-element';
import {
    controlHeight,
    fillHoverColor,
    iconColor,
    mediumPadding,
    smallPadding,
    borderWidth,
    dividerBackgroundColor,
    failColor
} from '../../theme-provider/design-tokens';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    :host {
        display: block;
    }

    .control {
        display: flex;
        align-items: center;
        gap: ${smallPadding};
        width: 100%;
        min-height: 44px;
        height: ${controlHeight};
        padding: 0 ${mediumPadding};
        background: transparent;
        color: inherit;
        border: none;
        text-align: left;
        cursor: pointer;
    }

    :host(:not([disabled])) .control:hover {
        background: ${fillHoverColor};
    }

    .control${focusVisible} {
        outline: var(--ni-focus-outline, 2px solid currentColor);
        outline-offset: 2px;
    }

    .heading {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    [part='start'],
    [part='end'] {
        display: contents;
    }

    .icon {
        margin-inline-start: auto;
        color: ${iconColor};
        transition: transform 200ms ease;
        display: inline-flex;
    }

    :host([expanded]) .icon {
        transform: rotate(180deg);
    }

    .region {
        border-top: ${borderWidth} solid ${dividerBackgroundColor};
        padding: ${smallPadding} ${mediumPadding};
    }

    :host([error-visible]) .control {
        background: color-mix(in oklab, ${failColor} 10%, transparent);
    }

    :host([disabled]) .control {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

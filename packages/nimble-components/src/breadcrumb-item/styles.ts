import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconSize,
    placeholderFontColor
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';
import { linkStyles } from '../patterns/link/styles';

export const styles = css`
    ${linkStyles}
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        color: ${bodyFontColor};
        padding-left: calc(4px - ${borderWidth});
    }

    .listitem {
        display: flex;
        align-items: center;
    }

    .control {
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${borderWidth} solid transparent;
        padding-right: calc(4px - ${borderWidth});
    }

    .control:any-link {
        color: var(--ni-private-breadcrumb-link-font-color);
    }

    .control:active {
        color: var(--ni-private-breadcrumb-link-active-font-color);
    }

    .control:any-link${focusVisible} {
        border: ${borderWidth} solid ${borderHoverColor};
        outline: 2px solid ${borderHoverColor};
        outline-offset: 1px;
    }

    .start,
    .end {
        display: flex;
        align-items: center;
    }

    .start {
        margin-inline-end: 4px;
    }

    slot[name='separator'] {
        display: flex;
        align-items: center;
    }

    slot[name='separator'] svg {
        width: ${iconSize};
        height: ${iconSize};
    }

    slot[name='separator'] path {
        fill: ${placeholderFontColor};
    }
`;

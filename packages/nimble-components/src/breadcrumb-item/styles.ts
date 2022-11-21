import { css } from '@microsoft/fast-element';
import {
    borderHoverColor,
    borderWidth,
    iconSize,
    placeholderFontColor
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';
import { styles as linkStyles } from '../patterns/link/styles';

export const styles = css`
    ${linkStyles}

    :host {
        padding-left: calc(4px - ${borderWidth});
    }

    .listitem {
        display: flex;
        align-items: center;
    }

    .control {
        border: ${borderWidth} solid transparent;
        padding-right: calc(4px - ${borderWidth});
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

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconSize,
    linkFont,
    placeholderFontColor
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        box-sizing: border-box;
        padding-left: calc(4px - ${borderWidth});

        ${
            /* When href removed the .control element is also removed
             so this becomes the fallback color for the slot */ ''
        }
        color: ${bodyFontColor};
        font: ${linkFont};
    }

    .listitem {
        display: flex;
        align-items: center;
    }

    .control {
        color: var(--ni-private-breadcrumb-link-font-color);
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${borderWidth} solid transparent;
        padding-right: calc(4px - ${borderWidth});
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control${focusVisible} {
        border: ${borderWidth} solid ${borderHoverColor};
        outline: 2px solid ${borderHoverColor};
        outline-offset: 1px;
    }

    .control:active {
        color: var(--ni-private-breadcrumb-link-active-font-color);
        text-decoration: underline;
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
        fill: ${placeholderFontColor};
    }
`;

import { css } from '@ni/fast-element';
import { display } from '@ni/nimble-components/dist/esm/utilities/style/display';
import {
    iconSize,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
        justify-content: center;
    }

    .breakpoint-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${iconSize};
        height: ${iconSize};
        flex-shrink: 0;
        padding: 0;
        margin: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        outline-offset: -1px;
    }

    .breakpoint-button:focus-visible {
        outline: 2px solid Highlight;
    }

    .breakpoint-button svg {
        width: ${iconSize};
        height: ${iconSize};
    }

    .breakpoint-button.state-off > * {
        opacity: 0;
    }

    .breakpoint-button.state-off:hover > *,
    .breakpoint-button.state-off:focus-visible > * {
        opacity: 1;
    }

`;

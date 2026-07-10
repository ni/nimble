import { css } from '@ni/fast-element';
import { display } from '@ni/nimble-components/dist/esm/utilities/style/display';
import {
    borderHoverColor,
    borderWidth,
    iconSize,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .breakpoint-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0;
        margin: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        outline-offset: -1px;
        width: ${iconSize};
        height: ${iconSize};
    }

    .breakpoint-button:focus-visible {
        outline: calc(2 * ${borderWidth}) solid ${borderHoverColor};
        outline-offset: -2px;
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

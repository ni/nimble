import { css } from '@microsoft/fast-element';
import { controlSlimHeight } from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        align-self: center;
        width: 100%;
        background: red;
    }

    nimble-menu-button {
        height: ${controlSlimHeight};
        width: 100%;
        background: purple;
    }

    .value-label {
        background: yellow;
        margin-right: auto;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 100%;
        align-content: center;
    }
`;

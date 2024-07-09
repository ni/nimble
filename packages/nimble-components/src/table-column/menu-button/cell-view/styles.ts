import { css } from '@microsoft/fast-element';
import { controlSlimHeight } from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        align-self: center;
        width: 100%;
    }

    nimble-menu-button {
        height: ${controlSlimHeight};
        width: 100%;
    }

    .value-label {
        margin-right: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

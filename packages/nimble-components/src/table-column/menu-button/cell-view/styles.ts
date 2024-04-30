import { css } from '@microsoft/fast-element';
import { controlSlimHeight } from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        width: fit-content;
        max-width: 100%;
        align-self: center;
    }

    nimble-menu-button {
        height: ${controlSlimHeight};
    }
`;

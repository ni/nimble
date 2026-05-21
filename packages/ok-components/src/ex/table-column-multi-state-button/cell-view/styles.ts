import { css } from '@ni/fast-element';
import { borderColor, borderHoverColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    :host {
        align-self: center;
        width: 100%;
    }

    button {
        width: 24px;
        height: 24px;
        border: 2px solid ${borderColor};
        background: green;
    }

    button.state-B {
        background: yellow;
    }

    button.state-C {
        background: red;
    }
`;

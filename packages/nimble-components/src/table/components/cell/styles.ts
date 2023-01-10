import { css } from '@microsoft/fast-element';
import { standardPadding } from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        padding: 0px calc(${standardPadding} / 2);
        align-self: center;
        display: inherit;
        height: 100%;
    }

    .cell-container {
        overflow: hidden;
        display: flex;
        align-items: center;
    }
`;

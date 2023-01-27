import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { standardPadding } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        padding: 0px calc(${standardPadding} / 2);
        align-self: center;
        height: 100%;
        grid-template-columns: 1fr auto;
    }

    .cell-content-container {
        overflow: hidden;
        display: flex;
        align-items: center;
    }
`;

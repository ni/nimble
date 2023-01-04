import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { standardPadding } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        display: flex;
        padding: 0px calc(${standardPadding} / 2);
        align-items: center;
    }

    .cell-content-container {
        flex: 1;
    }
`;

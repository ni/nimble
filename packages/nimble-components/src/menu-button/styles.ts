import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { controlHeight, smallPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        height: ${controlHeight};
    }

    [part='button'] {
        width: 100%;
        height: 100%;
    }

    [part='menu'] {
        z-index: 1;
    }

    slot[name='menu']::slotted(*) {
        margin-top: ${smallPadding};
        margin-bottom: ${smallPadding};
    }
`;

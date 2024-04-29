import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
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

    slot[name='menu']::slotted(*) {
        margin-top: ${smallPadding};
        margin-bottom: ${smallPadding};
    }
`;

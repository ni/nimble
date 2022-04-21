import { css } from '@microsoft/fast-element';
import { smallPadding } from '../theme-provider/design-tokens';

export const styles = css`
    slot[name="menu"] {
        display: contents;
    }

    slot[name="menu"]::slotted(*) {
        position: absolute;
        margin-top: ${smallPadding}
    }
`;

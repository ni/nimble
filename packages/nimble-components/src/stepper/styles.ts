import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { smallPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        border: none;
        gap: ${smallPadding};
    }

    :host([orientation="vertical"]) {
        flex-direction: column;
    }

    slot[name="step"]::slotted(*) {
        flex-grow: 1;
    }

    slot[name="step"]::slotted(:last-child) {
        flex-grow: 0;
    }
`;

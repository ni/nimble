import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    dividerBackgroundColor,
    smallPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        width: 100%;
    }

    ::slotted(nimble-accordion-item) {
        border-bottom: 1px solid ${dividerBackgroundColor};
        padding-block-end: ${smallPadding};
    }

    ::slotted(nimble-accordion-item:last-of-type) {
        border-bottom: none;
    }
`;

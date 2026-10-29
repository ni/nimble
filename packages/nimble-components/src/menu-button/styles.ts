import { css } from '@ni/fast-element';
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

    [popover] {
        position: fixed;
        inset: unset;
        margin: 0;
        padding: 0;
        border: none;
        overflow: visible;
        width: fit-content;
        position-area: var(--ni-private-preferred-position-area);
        position-try-fallbacks: var(--ni-private-position-fallbacks);
        align-self: var(--ni-private-menu-relative-alignment);
        margin-top: ${smallPadding};
        margin-bottom: ${smallPadding};
    }
`;

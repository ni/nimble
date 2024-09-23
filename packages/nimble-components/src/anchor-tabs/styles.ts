import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import { controlHeight } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
    }

    .tabsrootcontainer {
        display: flex;
    }

    [part='start'] {
        display: none;
    }

    .tablist {
        display: flex;
        width: max-content;
        min-width: calc(2 * ${controlHeight});
        align-self: end;
        overflow-x: scroll;
        scrollbar-width: none;
        margin-left: var(--ni-private-tabs-container-padding);
        margin-right: var(--ni-private-tabs-container-padding);
    }

    .scroll-button.right {
        position: relative;
        right: 0;
    }
`;

import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';

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

    .scroll-button {
        display: var(--ni-private-tabs-scroll-buttons-display);
    }

    .tablist {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        width: max-content;
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

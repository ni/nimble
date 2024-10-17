import { css } from '@microsoft/fast-element';
import { display } from '../../utilities/style/display';
import { smallPadding } from '../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
    }

    .tab-bar {
        display: flex;
    }

    [part='start'] {
        display: none;
    }

    .scroll-button.left {
        margin-right: ${smallPadding};
    }

    .tablist {
        display: flex;
        width: max-content;
        min-width: 
        align-self: end;
        overflow-x: scroll;
        scrollbar-width: none;
        margin-left: var(--ni-private-tabs-container-padding);
        margin-right: var(--ni-private-tabs-container-padding);
    }

    .scroll-button.right {
        margin-left: ${smallPadding};
        position: relative;
    }
`;

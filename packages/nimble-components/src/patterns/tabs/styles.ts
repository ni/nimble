import { css } from '@ni/fast-element';
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
        align-self: end;
        overflow-x: scroll;
        scrollbar-width: none;
    }

    .scroll-button.right {
        margin-left: ${smallPadding};
    }

    [part='end'] {
        flex: 1;
    }

    [part='tabpanel'] {
        flex: 1;
    }
`;

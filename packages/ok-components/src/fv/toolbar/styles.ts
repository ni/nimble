import { css } from '@ni/fast-element';
import { styles as toolbarStyles } from '@ni/nimble-components/dist/esm/toolbar/styles';

export const styles = css`
    ${toolbarStyles}

    :host {
        display: block;
        min-width: 0;
        max-width: 100%;
    }

    .positioning-region {
        overflow-x: auto;
    }

    [part='start'],
    [part='end'],
    nimble-menu-button,
    ::slotted(*) {
        flex-shrink: 0;
    }

    [part='start'] {
        margin: 0;
        margin-inline-end: auto;
    }

    [part='end'] {
        margin: 0;
        margin-inline-start: auto;
    }
`;

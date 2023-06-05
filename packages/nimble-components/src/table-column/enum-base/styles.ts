import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        display: contents;
    }

    .header-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    slot[name='mapping'] {
        display: none;
    }
`;

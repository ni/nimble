import { css } from '@ni/fast-element';

export const styles = css`
    :host {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .breakpoint-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        margin: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        outline-offset: -1px;
    }

    .breakpoint-button:focus-visible {
        outline: 2px solid Highlight;
    }

    .breakpoint-button svg {
        width: 12px;
        height: 12px;
    }

    .breakpoint-button.state-off svg {
        opacity: 0;
    }

    .breakpoint-button.state-off:hover svg,
    .breakpoint-button.state-off:focus-visible svg {
        opacity: 1;
    }
`;

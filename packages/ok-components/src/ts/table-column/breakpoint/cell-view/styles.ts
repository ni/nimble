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
        border-radius: 50%;
        outline-offset: -2px;
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

    .context-menu-button {
        position: absolute;
        width: 24px;
        height: 24px;
        pointer-events: none;
    }

    .context-menu-button::part(button) {
        opacity: 0;
        pointer-events: none;
    }

    .context-menu-button[open] {
        pointer-events: auto;
    }

    .context-menu-button::part(menu) {
        z-index: 1;
    }
`;

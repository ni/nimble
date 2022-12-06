import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';
import { linkStyles, linkColors } from '../patterns/link/styles';

export const styles = css`
    ${linkColors}
    ${linkStyles}

    [part='start'] {
        display: none;
    }

    .control${focusVisible} {
        outline: none;
        text-decoration: underline;
        box-shadow: inset 0px -1px var(--ni-private-link-font-color);
    }

    .control${focusVisible}:active {
        box-shadow: inset 0px -1px var(--ni-private-link-active-font-color);
    }

    :host([underline-visible]) .control {
        text-decoration: underline;
    }

    [part='end'] {
        display: none;
    }
`;

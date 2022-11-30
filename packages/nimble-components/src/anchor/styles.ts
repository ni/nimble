import { css } from '@microsoft/fast-element';
import { bodyDisabledFontColor } from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';
import { linkStyles, linkColors } from '../patterns/link/styles';

export const styles = css`
    ${linkColors}
    ${linkStyles}

    .start {
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

    :host([disabled]) .control {
        --ni-private-link-font-color: ${bodyDisabledFontColor};
        pointer-events: none;
        cursor: default;
    }

    .end {
        display: none;
    }
`;

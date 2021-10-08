import { css } from '@microsoft/fast-element';
import { 
    contentFontColor,
    iconSize,
    warningColor,
    failColor,
    passColor
 } from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: inline-flex;
        align-items: center;
        user-select: none;
        width: ${iconSize};
        height: ${iconSize};
        --icon-color: ${contentFontColor};
    }

    .icon {
        width: 100%;
        height: 100%;
    }

    :host(.fail) {
        --icon-color: ${failColor};
    }

    :host(.warning) {
        --icon-color: ${warningColor};
    }

    :host(.pass) {
        --icon-color: ${passColor};
    }

    .icon svg {
        fill: var(--icon-color);
    }
`;
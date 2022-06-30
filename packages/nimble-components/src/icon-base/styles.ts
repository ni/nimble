import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    iconSize,
    warningColor,
    failColor,
    passColor,
    iconColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
        user-select: none;
        width: ${iconSize};
        height: ${iconSize};
    }

    .icon {
        width: 100%;
        height: 100%;
    }

    :host(.fail) {
        ${iconColor.cssCustomProperty}: ${failColor};
    }

    :host(.warning) {
        ${iconColor.cssCustomProperty}: ${warningColor};
    }

    :host(.pass) {
        ${iconColor.cssCustomProperty}: ${passColor};
    }

    .icon svg {
        fill: ${iconColor};
        width: 100%;
        height: 100%;
    }
`;

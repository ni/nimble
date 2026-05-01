import { css } from '@ni/fast-element';
import {
    borderHoverColor,
    iconColor,
    iconSize,
    linkFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
    }

    .context-help-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: ${iconSize};
        height: ${iconSize};
        padding: 0;
        border: 0;
        border-radius: 2px;
        background: transparent;
        color: ${linkFontColor};
        cursor: help;
    }

    .context-help-trigger:focus-visible {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
    }

    .context-help-trigger > * {
        width: ${iconSize};
        height: ${iconSize};
        ${iconColor.cssCustomProperty}: currentColor;
    }

    nimble-tooltip:not(:defined) {
        display: none;
    }
`;
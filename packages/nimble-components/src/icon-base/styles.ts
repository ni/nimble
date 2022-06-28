import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { BannerFail100DarkUi, Information100LightUi } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
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

    :host(.tooltipError) {
        ${iconColor.cssCustomProperty}: ${BannerFail100DarkUi};
        width: 14px;
        height: 14px;
        padding-right: 8px;
    }
    
    :host(.tooltipInfo) {
        ${iconColor.cssCustomProperty}: ${Information100LightUi};
        width: 14px;
        height: 14px;
        padding-right: 8px;
    }

    .icon svg {
        fill: ${iconColor};
        width: 100%;
        height: 100%;
    }
`;

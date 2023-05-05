import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    iconSize,
    warningColor,
    failColor,
    passColor,
    iconColor,
    informationColor
} from '../theme-provider/design-tokens';
import { disableSelect } from '../utilities/style/user-select';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
        ${disableSelect}
        width: ${iconSize};
        height: ${iconSize};
    }

    .icon {
        width: 100%;
        height: 100%;
    }

    :host([severity='error']) {
        ${iconColor.cssCustomProperty}: ${failColor};
    }

    :host([severity='warning']) {
        ${iconColor.cssCustomProperty}: ${warningColor};
    }

    :host([severity='success']) {
        ${iconColor.cssCustomProperty}: ${passColor};
    }

    :host([severity='information']) {
        ${iconColor.cssCustomProperty}: ${informationColor};
    }

    .icon svg {
        fill: ${iconColor};
        width: 100%;
        height: 100%;
    }
`;

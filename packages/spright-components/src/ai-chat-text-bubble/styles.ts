import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        min-width: 8px;
        min-height: 8px;
    }

    div {
        font: ${bodyFont};
        color: ${bodyFontColor};
        background: ${fillSelectedColor};
        border: ${borderWidth} solid ${borderHoverColor};
        border-radius: 8px;
    }

    :host[actor='user'] div {
        border-radius: 8px 8px 8px 0px
    }
`;

import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    mediumPadding,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        min-width: 16px;
        min-height: 16px;
    }

    div {
        max-width: calc(100%-20px);
        width: fit-content;
        height: fit-content;
        padding: ${mediumPadding};
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

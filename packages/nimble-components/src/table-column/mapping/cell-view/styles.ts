import { css } from '@microsoft/fast-element';
import { display } from '../../../utilities/style/display';
import {
    bodyFont,
    bodyFontColor,
    iconSize,
    smallPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        gap: ${smallPadding};
        align-items: center;
    }

    .reserve-icon-size {
        flex-shrink: 0;
        width: ${iconSize};
        height: ${iconSize};
    }

    .text {
        flex-shrink: 1;
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

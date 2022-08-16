import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    borderWidth,
    popupBoxShadowColor,
    popupBorderColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    dialog {
        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: 0px 2px 3px ${popupBoxShadowColor};
        max-width: 50%;
    }
`;

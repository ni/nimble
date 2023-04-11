import { css } from '@microsoft/fast-element';
import {
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    nimble-anchor {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .placeholder {
        color: ${controlLabelFontColor};
    }
`;

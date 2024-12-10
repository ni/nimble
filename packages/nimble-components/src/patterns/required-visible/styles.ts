import { css } from '@microsoft/fast-element';
import {
    smallPadding
} from '../../theme-provider/design-tokens';

export const styles = css`
    .annotated-label {
        display: flex;
        flex-direction: row;
    }

    .required-icon {
        flex: none;
        width: 5px;
        height: 5px;
        margin-top: 3px;
        margin-left: ${smallPadding};
    }
`;

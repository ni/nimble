import { css } from '@microsoft/fast-element';
import {
    applicationBackgroundColor,
    smallPadding,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    .positioning-region {
        display: flex;
        padding: ${smallPadding} ${standardPadding};
        align-items: center;
        gap: ${standardPadding};
        background: ${applicationBackgroundColor};
    }

    slot[name='label'] {
        display: none;
    }

    [part='start'] {
        display: flex;
        gap: ${standardPadding};
        margin-right: auto;
    }

    [part='end'] {
        display: flex;
        gap: ${standardPadding};
        margin-left: auto;
    }
`;

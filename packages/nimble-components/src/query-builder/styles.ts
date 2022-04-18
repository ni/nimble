import { css } from '@microsoft/fast-element';
import {
    standardPadding,
    smallPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    .switch-group {
        display: flex;
        width: 100%;
    }

    .rule-row {
        display: flex;
        padding: ${standardPadding};
        gap: ${smallPadding};
    }

    .button-container {
        margin-left: auto;
    }
  `;

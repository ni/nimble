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

    .nested-rule-set {
        padding: ${standardPadding};
        padding-right: 0px;
    }

    .rule-row {
        display: flex;
        padding: ${standardPadding};
        padding-right: 0px;
        gap: ${smallPadding};
    }

    .button-container {
        margin-left: auto;
    }
  `;

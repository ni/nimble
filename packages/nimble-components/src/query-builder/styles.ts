import { css } from '@ni/fast-element';
import {
    standardPadding,
    mediumPadding
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
        display: grid;
        grid-template-columns: repeat(3, 1fr) auto;
        padding: ${standardPadding};
        padding-right: 0px;
        gap: ${mediumPadding};
    }

    .button-container {
        margin-left: auto;
    }
`;
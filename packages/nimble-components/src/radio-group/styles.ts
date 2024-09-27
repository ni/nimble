import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    controlLabelDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor,
    smallPadding,
    standardPadding
} from '../theme-provider/design-tokens';
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-block')}
    ${errorStyles}

    .positioning-region {
        display: flex;
        gap: ${standardPadding};
        position: relative;
    }

    :host([orientation='vertical']) .positioning-region {
        flex-direction: column;
    }

    :host([orientation='vertical']) slotted([role='radio']) {
        width: 100%;
    }

    :host([orientation='horizontal']) .positioning-region {
        flex-direction: row;
    }

    .label-container {
        display: flex;
        gap: ${smallPadding};
        margin-bottom: ${smallPadding};
    }

    slot[name='label'] {
        font: ${controlLabelFont};
        color: ${controlLabelFontColor};
        display: inline-flex;
    }

    :host([disabled]) slot[name='label'] {
        color: ${controlLabelDisabledFontColor};
    }

    .error-icon {
        margin-left: auto;
    }
`;

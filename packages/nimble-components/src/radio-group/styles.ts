import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    controlLabelDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor,
    controlLabelFontLineHeight,
    smallPadding,
    standardPadding
} from '../theme-provider/design-tokens';
import { styles as errorStyles } from '../patterns/error/styles';
import { styles as requiredVisibleStyles } from '../patterns/required-visible/styles';

export const styles = css`
    ${display('inline-block')}
    ${errorStyles}
    ${requiredVisibleStyles}

    .positioning-region {
        display: flex;
        gap: ${standardPadding};
        position: relative;
    }

    :host([orientation='vertical']) .positioning-region {
        flex-direction: column;
    }

    :host([orientation='horizontal']) .positioning-region {
        flex-direction: row;
    }

    .label-container {
        display: flex;
        height: ${controlLabelFontLineHeight};
        gap: ${smallPadding};
        margin-bottom: ${smallPadding};
    }

    slot[name='label'] {
        font: ${controlLabelFont};
        color: ${controlLabelFontColor};
    }

    :host([disabled]) slot[name='label'] {
        color: ${controlLabelDisabledFontColor};
    }

    .required-icon {
        margin-left: 0px;
    }

    .error-icon {
        margin-left: auto;
        margin-right: ${smallPadding};
    }
`;

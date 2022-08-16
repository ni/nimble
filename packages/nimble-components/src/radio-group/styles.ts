import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlLabelDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    .positioning-region {
        display: flex;
    }

    :host([orientation='vertical']) .positioning-region {
        flex-direction: column;
    }

    :host([orientation='horizontal']) .positioning-region {
        flex-direction: row;
    }

    slot[name='label'] {
        font: ${controlLabelFont};
        color: ${controlLabelFontColor};
    }

    :host([disabled]) slot[name='label'] {
        color: ${controlLabelDisabledFontColor};
    }
`;

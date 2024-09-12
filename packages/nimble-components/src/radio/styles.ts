import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    iconSize,
    smallDelay
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';
import { styles as errorStyles } from '../patterns/error/styles';
import { userSelectNone } from '../utilities/style/user-select';
import { commonStyles } from '../checkbox/styles';

export const styles = css`
    ${commonStyles}

    .control {
        border-radius: 100%;
    }

    :host(${focusVisible}) .control {
        border-color: ${borderHoverColor};
    }

    :host(${focusVisible}) .control::after {
        content: '';
        position: absolute;
        width: calc(2px + ${controlHeight} / 2);
        height: calc(2px + ${controlHeight} / 2);
        border: 2px solid ${borderHoverColor};
        border-radius: 100%;
    }

    :host(.checked) slot[name='checked-indicator'] {
        display: contents;
    }

    slot[name='checked-indicator'] circle {
        fill: ${borderColor};
    }

    :host([disabled]) slot[name='checked-indicator'] circle {
        fill: rgba(${borderRgbPartialColor}, 0.3);
    }
`;

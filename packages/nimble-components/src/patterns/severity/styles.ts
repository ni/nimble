import { cssPartial } from '@ni/fast-element';
import {
    failColor,
    errorTextFont,
    errorTextFontLineHeight
} from '../../theme-provider/design-tokens';

// These styles end up inside a @layer block so must use the
// cssPartial tag instead of the css tag
export const styles = cssPartial`
    .severity-text {
        display: none;
    }

    :host([severity]) .severity-text {
        display: block;
        font: ${errorTextFont};
        color: ${failColor};
        width: 100%;
        position: absolute;
        ${'' /* The -2px modifier of the bottom position is to intentionally have the severity text slightly overlap the control by 2px */}
        bottom: calc(-1 * (${errorTextFontLineHeight} - 2px));
        left: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :host([severity]) .severity-text:empty {
        display: none;
    }
`;

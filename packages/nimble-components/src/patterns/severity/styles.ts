import { cssPartial } from '@ni/fast-element';
import {
    failColor,
    errorTextFont,
    buttonLabelFontColor,
    warningFontColor,
} from '../../theme-provider/design-tokens';

// These styles end up inside a @layer block so must use the
// cssPartial tag instead of the css tag
export const styles = cssPartial`
    .severity-text {
        display: none;
        font: ${errorTextFont};
        color: ${buttonLabelFontColor};
        position: absolute;
        padding: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    :host([severity="error"]) .severity-text {
        display: block;
        color: ${failColor};
    }

    :host([severity="warning"]) .severity-text {
        display: block;
        color: ${warningFontColor};
    }
    .severity-text:empty {
        display: none;
    }
`;

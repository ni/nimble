import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { controlSlimHeight, errorTextFontLineHeight, smallPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        border: none;
        gap: 0px;
        ${'' /* Based on text layout: Top padding + title height + subtitle height + bottom padding */}
        --ni-private-step-height: calc(${smallPadding} + ${controlSlimHeight} + ${errorTextFontLineHeight} + ${smallPadding});
    }

    :host([orientation="vertical"]) {
        flex-direction: column;
        --ni-private-step-height: 100px;
    }
`;

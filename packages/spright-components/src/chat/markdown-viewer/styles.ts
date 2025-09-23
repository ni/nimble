import { css } from '@ni/fast-element';

import {
    bodyFont,
    bodyFontColor,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }
`;

import { css } from '@ni/fast-element';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('block')}

        :host {
            min-width: 0;
            font: ${bodyFont};
            color: ${bodyFontColor};
        }

        [part='chart'] {
            width: 100%;
            height: 100%;
            min-width: 0;
        }
    }
`;

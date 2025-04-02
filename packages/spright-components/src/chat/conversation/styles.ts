import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    mediumPadding,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        justify-content: flex-start;
        row-gap: 32px;
        padding: ${mediumPadding};
        background: ${applicationBackgroundColor};
        overflow-y: auto;
    }
`;

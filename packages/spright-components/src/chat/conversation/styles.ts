import { css } from '@microsoft/fast-element';
import {
    applicationBackgroundColor,
    mediumPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        justify-content: flex-start;
        row-gap: ${standardPadding};
        padding: ${mediumPadding};
        background: ${applicationBackgroundColor};
        overflow-y: auto;
    }
`;

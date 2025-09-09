import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    borderWidth,
    sectionBackgroundImage,
    mediumPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${applicationBackgroundColor};
    }

    :host([appearance='overlay']) {
        background: none;
        border-color: transparent;
    }

    .messages {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        row-gap: 32px;
        padding: ${mediumPadding} ${standardPadding} ${mediumPadding}
            ${standardPadding};
        background: ${sectionBackgroundImage};
        overflow-y: auto;
    }

    :host([appearance='overlay']) .messages {
        background: none;
    }

    .input {
        padding: ${borderWidth} ${standardPadding} ${standardPadding}
            ${standardPadding};
    }

    .input.input-empty {
        padding: 0px ${standardPadding} 0px ${standardPadding};
    }
`;

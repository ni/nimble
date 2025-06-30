import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    borderWidth,
    chatConversationBackgroundGradientStartColor,
    chatConversationBackgroundGradientEndColor,
    mediumPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        background: ${applicationBackgroundColor};
    }

    .messages {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        row-gap: 32px;
        padding: ${mediumPadding} ${standardPadding} ${mediumPadding}
            ${standardPadding};
        border: ${borderWidth} solid ${applicationBackgroundColor};
        background: linear-gradient(
            ${chatConversationBackgroundGradientStartColor},
            ${chatConversationBackgroundGradientEndColor}
        );
        overflow-y: auto;
    }

    .input {
        padding: ${mediumPadding} ${standardPadding} ${standardPadding}
            ${standardPadding};
    }
`;

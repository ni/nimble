import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    chatConversationBackgroundGradientStartColor,
    chatConversationBackgroundGradientEndColor,
    mediumPadding
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
        padding: 8px 32px 8px 32px;
        background: linear-gradient(
            ${chatConversationBackgroundGradientStartColor},
            ${chatConversationBackgroundGradientEndColor}
        );
        overflow-y: auto;
    }

    .input {
        padding: 8px 32px 4px 32px;
    }
`;

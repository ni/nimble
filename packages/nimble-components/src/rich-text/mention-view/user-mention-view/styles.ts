import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { atMentionFontColor } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    span {
        color: ${atMentionFontColor};
    }
`;

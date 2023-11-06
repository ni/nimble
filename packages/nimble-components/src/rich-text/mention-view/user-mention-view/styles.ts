import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { linkProminentFontColor } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline')}

    span {
        color: ${linkProminentFontColor};
        user-select: text;
    }
`;

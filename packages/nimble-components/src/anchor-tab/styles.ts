import { css } from '@microsoft/fast-element';
import { styles as tabStyles } from '../patterns/tab/styles';
import { bodyFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${tabStyles}

    a {
        text-decoration: none;
        color: ${bodyFontColor};
    }
`;

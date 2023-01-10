import { css } from '@microsoft/fast-element';
import { styles as tabStyles } from '../patterns/tab/styles';

export const styles = css`
    ${tabStyles}

    a {
        text-decoration: none;
        color: inherit;
        cursor: inherit;
    }
`;

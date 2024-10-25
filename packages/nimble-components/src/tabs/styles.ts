import { css } from '@microsoft/fast-element';
import { styles as tabsStyles } from '../patterns/tabs/styles';

export const styles = css`
    ${tabsStyles}

    .tabpanel {
        overflow: auto;
    }
`;

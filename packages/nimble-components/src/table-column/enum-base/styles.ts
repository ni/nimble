import { css } from '@ni/fast-element';
import { styles as baseStyles } from '../base/styles';

export const styles = css`
    ${baseStyles}

    slot[name='mapping'] {
        display: none;
    }
`;

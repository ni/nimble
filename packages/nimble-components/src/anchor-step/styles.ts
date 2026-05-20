import { css } from '@ni/fast-element';
import { styles as stepStyles } from '../patterns/step/styles';

export const styles = css`
    ${stepStyles}
    ${'' /* Anchor specific styles */}
    @layer base {
        .control {
            text-decoration: none;
        }
    }
`;

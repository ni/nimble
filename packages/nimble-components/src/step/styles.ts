import { css } from '@ni/fast-element';
import { styles as stepStyles } from '../patterns/step/styles';

export const styles = css`
    ${stepStyles}
    ${'' /* Button specific styles */}
    @layer base {
        .control {
            border: none;
            text-align: start;
        }
    }
`;

import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('inline-flex')}

    :host {
        border: 1px solid blue;
        gap: 0px;
    }
`;

import { css } from '@microsoft/fast-element';
import {
    applicationBackgroundColor,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';
import { chatMessageTag } from '../message';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        justify-content: flex-start;
        row-gap: ${standardPadding};
        background: ${applicationBackgroundColor};
        overflow-y: scroll;
    }

    ${chatMessageTag} {
        animation: show 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;
    
        opacity: 0;
    
        transform: rotateX(-90deg);
        transform-origin: top center;
    }
  
    @keyframes show {
        100% {
            opacity: 1;
            transform: none;
        }
    }
`;

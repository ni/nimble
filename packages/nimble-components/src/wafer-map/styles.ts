import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('inline-block')}

    :host {
        aspect-ratio: 1;
        height: inherit;
        width: inherit;
    }

    svg {
        filter: drop-shadow(2px 0 black) drop-shadow(-2px 0 black) drop-shadow(0 2px black) drop-shadow(0 -2px black)
    }

    .circleBase {
        width: inherit;
        height: inherit;
        position: absolute;
        fill: white;
    }

    .right {
        transform: rotate(0deg);
    }
    
    .left {
    transform: rotate(180deg);
    }
    
    .top {
    transform: rotate(-90deg);
    }
    
    .bottom {
    transform: rotate(90deg);
    }
`;

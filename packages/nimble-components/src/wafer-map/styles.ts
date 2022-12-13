import { css } from '@microsoft/fast-element';
import {
    borderColor, borderWidth
} from '../theme-provider/design-tokens';

export const styles = css`

.wafer-map-container {
    width: 500px;
    height: 500px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.svg-root {
    width: inherit;
    height: inherit;
}

.top {
    transform: rotate(-90deg);
}

.right {
    transform: rotate(0deg);
}

.left {
    transform: rotate(180deg);
}

.bottom {
    transform: rotate(90deg);
}

.zoom-container {
    width: inherit;
    height: inherit;
}

.circle-base {
    width: inherit;
    height: inherit;
    position: absolute;
    fill: white;
}

.circle-drawing-path{
    shape-rendering: "crispEdges";    
    vector-effect: non-scaling-stroke;
    stroke-width: ${borderWidth};
    stroke: ${borderColor};
}

.wafer-map-area {
    position: absolute;
}
`;

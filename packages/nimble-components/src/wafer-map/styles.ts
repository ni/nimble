import { css } from '@microsoft/fast-element';
import { borderColor, borderWidth } from '../theme-provider/design-tokens';

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
        width: 100%;
        height: 100%;
    }

    .svg-root.top {
        transform: rotate(-90deg);
    }

    .svg-root.right {
        transform: rotate(0deg);
    }

    .svg-root.left {
        transform: rotate(180deg);
    }

    .svg-root.bottom {
        transform: rotate(90deg);
    }

    .zoom-container {
        width: 100%;
        height: 100%;
    }

    .circle-base {
        width: 100%;
        height: 100%;
        position: absolute;
        fill: white;
    }

    .circle-drawing-path {
        shape-rendering: 'crispEdges';
        vector-effect: non-scaling-stroke;
        stroke-width: ${borderWidth};
        stroke: ${borderColor};
    }

    .wafer-map-area {
        position: absolute;
    }
`;

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

    .circle-base {
        transform-origin: center;
    }

    .circle-base.top {
        transform: rotate(-90deg);
    }

    .circle-base.right {
        transform: rotate(0deg);
    }

    .circle-base.left {
        transform: rotate(180deg);
    }

    .circle-base.bottom {
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

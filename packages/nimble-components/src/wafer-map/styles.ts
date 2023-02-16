import { css } from '@microsoft/fast-element';
import { borderColor, borderWidth } from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: inline-block;
        width: 500px;
        height: 500px;
    }

    .wafer-map-container {
        width: 100%;
        height: 100%;
        position: relative;
        display: inline-block;
        justify-content: center;
        align-items: center;
    }

    .svg-root {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .notch {
        transform-origin: center center;
    }

    .notch.top {
        transform: rotate(-90deg);
    }

    .notch.right {
        transform: rotate(0deg);
    }

    .notch.left {
        transform: rotate(180deg);
    }

    .notch.bottom {
        transform: rotate(90deg);
    }

    .circle-base {
        fill: white;
    }

    .circle-drawing-path {
        shape-rendering: 'crispEdges';
        vector-effect: non-scaling-stroke;
        stroke-width: ${borderWidth};
        stroke: ${borderColor};
    }

    .wafer-map-canvas {
        display: inline-block;
        position: absolute;
    }
`;

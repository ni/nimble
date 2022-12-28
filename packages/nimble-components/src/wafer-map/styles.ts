import { css } from '@microsoft/fast-element';
import { borderColor, borderWidth } from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: inline-block;
        width: 100%;
        height: 100%;
    }

    .wafer-map-container {
        width: 100%;
        padding-bottom: 100%;
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

    .circle-base {
        width: 100%;
        height: 100%;
        position: absolute;
        fill: white;
    }

    .top {
        transform: rotate(-90deg);
        transform-origin: center center;
    }

    .right {
        transform: rotate(0deg);
        transform-origin: center center;
    }

    .left {
        transform: rotate(180deg);
        transform-origin: center center;
    }

    .bottom {
        transform: rotate(90deg);
        transform-origin: center center;
    }

    .zoom-container {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .circle-base {
        width: 100%;
        height: 100%;
        position: absolute;
        fill: transparent;
    }

    .circle-drawing-path {
        shape-rendering: 'crispEdges';
        vector-effect: non-scaling-stroke;
        stroke-width: ${borderWidth};
        stroke: ${borderColor};
    }

    .wafer-map-area {
        position: absolute;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .wafer-map-canvas {
        display: inline-block;
        width: inherit;
        height: inherit;
        width: 100%;
        height: 100%;
    }
`;

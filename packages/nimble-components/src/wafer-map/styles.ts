import { css } from '@ni/fast-element';
import { DigitalGreenLight } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { borderColor, borderWidth } from '../theme-provider/design-tokens';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        width: 500px;
        height: 500px;
    }

    .main-wafer {
        display: inline-block;
        position: absolute;
    }

    .worker-wafer {
        display: inline-block;
        position: absolute;
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

    .hover-layer {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;
    }

    .hover-rect {
        fill: transparent;
        stroke: white;
        outline-style: solid;
        outline-color: ${DigitalGreenLight};
    }

    .hover-rect.show {
        opacity: 1;
        stroke-width: 2px;
        outline-width: 2px;
    }

    .hover-rect.hide {
        opacity: 0;
        stroke-width: 0px;
        outline-width: 0px;
    }
`;

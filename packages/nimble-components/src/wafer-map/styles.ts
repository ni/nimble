import { css } from '@microsoft/fast-element';

export const styles = css`

.waferMapContainer {
width: 245px;
height: 245px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
::ng-deep{
canvas {
    position: absolute;
}
svg {
    overflow: hidden;
    position: absolute;
}

.waferMapArea {
    width: 245px;
    height: 245px;
    position: absolute;
svg {
    pointer-events: none;
    overflow: hidden;
    }

.hiddenCanvas {
    display: none;
}
}
}
}

.circleBase {
    width: inherit;
    height: inherit;
    position: absolute;
    fill: white;
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

.waferCanvas, .svgRoot {
  width: 245px;
  height: 245px;
}
`;

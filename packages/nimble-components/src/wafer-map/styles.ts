import { css } from '@microsoft/fast-element';

export const styles = css`
.waferMapContainer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.waferMapArea {
    position: absolute;
}

.waferCanvas{
    position: absolute;
}

.circleBase {
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
.waferMapContainer, .svgRoot, .circleBase, .zoomContainer {
  width: 500px;
  height: 500px;
}
`;

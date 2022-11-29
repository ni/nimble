import { css } from '@microsoft/fast-element';

export const styles = css`
.waferMapContainer {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.waferCanvas {
    position: absolute;
    svg {
        overflow: hidden;
        position: absolute;
    }
}

.waferMapArea {
    position: absolute;
svg {
    pointer-events: none;
    overflow: hidden;
    }
.hiddenCanvas {
    display: none;
}
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
.waferMapContainer, .waferCanvas, .svgRoot, .circleBase, .zoomContainer {
  width: 245px;
  height: 245px;
}
`;

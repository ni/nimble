import { css } from '@microsoft/fast-element';
import { borderColorRgb, borderColorHover, controlHeight, standardPadding, fontFamily, fontColor, fillColorSelected, contentFontSize } from '../theme-provider/design-tokens';

export const styles = css`
:host {
    display: inline-block;
    border: 1px solid rgba(${borderColorRgb}, 0.3);
    background-color: transparent;
    height: ${controlHeight};
    color: ${fontColor};
    font-family: ${fontFamily};
    font-size: ${contentFontSize};
    cursor: pointer;
    text-align: center;
    outline: none;
}

:host(:hover) {
    border: 1px solid ${borderColorHover};
    box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
}

:host(:active) {
    background-color: ${fillColorSelected};
    border-color: transparent;
    box-shadow: none;
}

.control {
    background-color: transparent;
    height: inherit;
    border: 0px solid transparent;
    color: inherit;
    border-radius: inherit;
    fill: inherit;
    cursor: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    outline: none;
    padding: 0 ${standardPadding};
}`;

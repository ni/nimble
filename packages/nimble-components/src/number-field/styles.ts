import { css } from '@microsoft/fast-element';
import {
    borderColor,
    borderColorHover,
    fillColorSelectedRgb,
    fontFamily,
    labelFontColor,
    labelFontFamily,
    labelFontSize,
    labelTextTransform
} from '../theme-provider/design-tokens';

export const styles = css`
  :host {
    display: inline-block;
    font-family: ${fontFamily};
    outline: none;
    user-select: none;
    color: ${labelFontColor};
  }

  .root {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: row;
    border-radius: 0px;
    font-family: ${fontFamily};
    border-bottom: 2px solid ${borderColor};
  }

  .root:hover {
    border-bottom: 2px solid ${borderColorHover};
  }

  .control {
    -webkit-appearance: none;
    font: inherit;
    background: transparent;
    border: 0;
    color: inherit;
    height: 28px;
    width: 100%;
    margin-top: auto;
    margin-bottom: auto;
    border: none;
  }

  .control:hover,
  .control:focus,
  .control:disabled,
  .control:active {
    outline: none;
  }

  .control::selection {
    color: ${labelFontColor};
    background: rgba(${fillColorSelectedRgb}, 0.3);
  }

  .control::placeholder {
    color: ${labelFontColor};
    opacity: 0.5;
  }

  .control:focus-within::placeholder {
    opacity: 1;
  }

  .label {
    font-family: ${labelFontFamily};
    font-size: ${labelFontSize};
    line-height: 16px;
    text-transform: ${labelTextTransform};
  }

  .controls {
    display: flex;
    flex-direction: column;
  }

  .step-up,
  .step-down {
    display: inline-flex;
    height: 15px;
    width: 15px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }

  .step-up svg,
  .step-down svg {
    height: 10px;
    width: 10px;
    fill: ${borderColor};
  }
`;

import { css } from '@microsoft/fast-element';
import { nimbleIconFontStyles } from '../shared/icon-font';
import {
    borderColor,
    borderColorHover,
    fillColorSelectedRgb,
    fontFamily,
    fontColor,
    labelFontFamily,
    labelFontSize
} from '../theme-provider/design-tokens';

export const styles = css`
  ${nimbleIconFontStyles}

  :host {
    display: inline-block;
    font-family: ${fontFamily};
    outline: none;
    user-select: none;
    color: ${fontColor};
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
    color: ${fontColor};
    background: rgba(${fillColorSelectedRgb}, 0.3);
  }

  .control::placeholder {
    color: ${fontColor};
    opacity: 0.5;
  }

  .control:focus-within::placeholder {
    opacity: 1;
  }

  .label {
    font-family: ${labelFontFamily};
    font-size: ${labelFontSize};
    line-height: 16px;
    text-transform: uppercase;
  }

  .nimble-icons-DownArrow,
  .nimble-icons-UpArrow {
    display: block;
    cursor: pointer;
    font-size: 10px;
    height: 15px;
  }

  .nimble-icons-DownArrow:before,
  .nimble-icons-UpArrow:before {
    display: block;
    border-bottom: solid transparent 4px;
  }
`;

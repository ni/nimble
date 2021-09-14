import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColorHover,
    borderWidth,
    contentFontColor,
    contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    fillColorHover,
    fontFamily,
    standardPadding
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')} :host {
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        height: ${controlHeight};
        padding: calc(${standardPadding} / 2) ${standardPadding}
            calc(${standardPadding} / 2 - ${borderWidth});
        color: ${contentFontColor};
        align-items: center;
        justify-content: center;
        cursor: pointer;
        ${/* Separate focus indicator from active indicator */ ''}
        border-bottom: transparent ${borderWidth} solid;
    }

    :host(:hover) {
        background-color: ${fillColorHover};
    }

    :host(${focusVisible}) {
        outline: none;
        box-shadow: 0 calc(${borderWidth} * -1) ${borderColorHover} inset;
    }

    :host(:active) {
        background: none;
    }

    :host([disabled]) {
        cursor: default;
        color: ${contentFontColorDisabled};
        background: none;
    }
`;

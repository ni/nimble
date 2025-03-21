import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { focusVisible } from '../utilities/style/focus';

import {
    borderHoverColor,
    fillSelectedColor,
    fillHoverSelectedColor,
    fillHoverColor,
    bodyFont,
    bodyDisabledFontColor,
    controlHeight
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        cursor: pointer;
        justify-content: left;
        height: ${controlHeight};
    }

    :host([aria-selected='true']) {
        box-shadow: none;
        outline: none;
        background-color: ${fillSelectedColor};
    }

    :host([aria-selected='true']:hover) {
        background-color: ${fillHoverSelectedColor};
    }

    :host(:hover) {
        background-color: ${fillHoverColor};
    }

    :host(:hover):host([disabled]) {
        box-shadow: none;
        background-color: transparent;
    }

    :host(:${focusVisible}) {
        box-shadow: 0px 0px 0px 1px ${borderHoverColor} inset;
        outline: 1px solid ${borderHoverColor};
        outline-offset: -4px;
    }

    :host(:active) {
        box-shadow: none;
        outline: none;
        background-color: ${fillSelectedColor};
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
        cursor: default;
    }

    :host([visually-hidden]) {
        display: none;
    }

    [part='start'] {
        display: none;
    }

    .content {
        padding: 8px 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .content[disabled] {
        box-shadow: none;
        outline: none;
    }

    [part='end'] {
        display: none;
    }
`;

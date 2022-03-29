import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    fillSelectedRgbPartialColor,
    bodyFont,
    controlLabelFontColor,
    smallDelay,
    standardPadding
} from '../../theme-provider/design-tokens';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    ${display('flex')}

    :host {
        flex-wrap: wrap;
        font: ${bodyFont};
        outline: none;
        user-select: none;
        --webkit-user-select: none;
        align-items: center;
        color: ${bodyFontColor};
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }

    ::slotted(input) {
        height: ${controlHeight};
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        font: inherit;
        align-items: center;
        outline: none;
        -webkit-appearance: none;
        background: transparent;
        color: inherit;
        padding-top: 0px;
        padding-bottom: 0px;
        margin-top: auto;
        margin-bottom: auto;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        text-overflow: ellipsis;
        --ni-private-bottom-border-width: 1px;
        --ni-private-hover-bottom-border-width: 2px;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        border-radius: 0px;
        border-bottom-width: var(--ni-private-bottom-border-width);
        padding-bottom: calc(
            var(--ni-private-hover-bottom-border-width) -
                var(--ni-private-bottom-border-width)
        );
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
    }

    ::slotted(input${focusVisible}) {
        border-bottom-color: ${borderHoverColor};
    }

    @media (prefers-reduced-motion) {
        ::slotted(input) {
            transition-duration: 0s;
        }
    }

    ::slotted(input:hover) {
        --ni-private-bottom-border-width: var(
            --ni-private-hover-bottom-border-width
        );
        border-bottom-color: ${borderHoverColor};
    }

    ::slotted(input::selection) {
        color: ${controlLabelFontColor};
        background: rgba(${fillSelectedRgbPartialColor}, 0.3);
    }

    ::slotted(input::placeholder) {
        color: ${controlLabelFontColor};
    }
`;

import { css } from '@ni/fast-element';
import { display } from '../../utilities/style/display';
import { focusVisible } from '../../utilities/style/focus';
import {
    borderHoverColor,
    borderWidth,
    buttonLabelFont,
    buttonLabelFontColor,
    buttonLabelDisabledFontColor,
    controlHeight,
    fillSelectedColor,
    iconColor,
    smallDelay,
    standardPadding,
} from '../../theme-provider/design-tokens';

import { accessiblyHidden } from '../../utilities/style/accessibly-hidden';

export const styles = css`
    @layer base, checked, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-flex')}

        :host {
            background-color: transparent;
            height: ${controlHeight};
            color: ${buttonLabelFontColor};
            font: ${buttonLabelFont};
            cursor: pointer;
            white-space: nowrap;
            outline: none;
            border: 1px solid red;
            ${
                /*
                    Not sure why but this is needed to get buttons with icons and buttons
                    without icons to align on the same line when the button is inline-flex
                    See: https://github.com/ni/nimble/issues/503
                */ ''
            }
            vertical-align: middle;
        }

        .control {
            background-color: transparent;
            height: 100%;
            width: 100%;
            border: ${borderWidth} solid transparent;
            color: inherit;
            border-radius: inherit;
            fill: inherit;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: inherit;
            font: inherit;
            outline: none;
            margin: 0; 
            padding: 0 ${standardPadding};
            position: relative;
            transition:
                box-shadow ${smallDelay} ease-in-out,
                border-color ${smallDelay} ease-in-out,
                background-size ${smallDelay} ease-in-out;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
        }

        :host([content-hidden]) .control {
            aspect-ratio: 1 / 1;
            padding: 0px;
        }

        .control::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            outline: 0px solid transparent;
            color: transparent;
            background-clip: border-box;
            transition: outline ${smallDelay} ease-in-out;
        }

        .content {
            display: contents;
        }

        [part='start'] {
            display: contents;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }

        slot[name='start']::slotted(*) {
            flex-shrink: 0;
        }

        :host([content-hidden]) .content {
            ${accessiblyHidden}
        }

        [part='end'] {
            display: contents;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }

        slot[name='end']::slotted(*) {
            flex-shrink: 0;
        }
    }

    @layer hover {
        .control:hover {
            border-color: ${borderHoverColor};
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        }
    }

    @layer focusVisible {
        .control${focusVisible} {
            border-color: ${borderHoverColor};
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        }

        .control${focusVisible}::before {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -3px;
        }
    }

    @layer active {
        .control:active {
            box-shadow: none;
            color: ${buttonLabelFontColor};
            border-color: ${borderHoverColor};
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            background-size: calc(100% - 2px) calc(100% - 2px);
        }

        .control:active::before {
            outline: none;
        }

        .control:active [part='start'],
        .control:active [part='end'] {
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }
    }

    @layer disabled {
        :host([disabled]) {
            cursor: default;
        }

        :host([disabled]) .control {
            color: ${buttonLabelDisabledFontColor};
            box-shadow: none;
            background-image: none;
            background-size: 100% 100%;
        }

        :host([disabled]) .control::before {
            box-shadow: none;
        }

        :host([disabled]) slot[name='start']::slotted(*),
        :host([disabled]) slot[name='end']::slotted(*) {
            opacity: 0.3;
            ${iconColor.cssCustomProperty}: ${buttonLabelFontColor};
        }
    }

    @layer top {
        @media (prefers-reduced-motion) {
            .control {
                transition-duration: 0s;
            }
        }

        :host([content-hidden]) [part='end'] {
            display: none;
        }
    }
`;

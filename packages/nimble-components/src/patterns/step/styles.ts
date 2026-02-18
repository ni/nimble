import { css } from '@ni/fast-element';
import { display } from '../../utilities/style/display';
import {
    buttonLabelFont,
    buttonLabelFontColor,
    smallPadding,
    bodyFont,
    errorTextFont,
    controlSlimHeight,
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    smallDelay,
    fillSelectedColor,
    passColor,
    failColor,
    warningColor
} from '../../theme-provider/design-tokens';
import { styles as severityStyles } from '../severity/styles';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-flex')}
        ${severityStyles}
        :host {
            height: 46px;
            color: ${buttonLabelFontColor};
            font: ${buttonLabelFont};
            white-space: nowrap;
            outline: none;
            border: none;
        }

        ${'' /* Container wrapper for severity text to position against */}
        .container {
            display: inline-flex;
            width: 100%;
            height: 100%;
            position: relative;
        }

        .control { 
            display: inline-flex;
            align-items: start;
            justify-content: flex-start;
            height: 100%;
            width: 100%;
            color: inherit;
            background-color: transparent;
            gap: ${smallPadding};
            cursor: pointer;
            outline: none;
            margin: 0; 
            padding: 0 ${smallPadding} 0 0;
            --ni-private-step-icon-background-full-size: 100% 100%;
            ${'' /* 6px = (2px icon border + 1px inset) * 2 sides */}
            --ni-private-step-icon-background-inset-size: calc(100% - 6px) calc(100% - 6px);
            --ni-private-step-icon-background-none-size: 0% 0%;

            --ni-private-step-icon-border-color: transparent;
            --ni-private-step-icon-background-color: rgba(${borderRgbPartialColor}, 0.1);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-icon-outline-inset-color: transparent;
            --ni-private-step-line-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([severity="error"]) .control {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-color: rgb(from ${failColor} r g b / 30%);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-color: rgb(from ${warningColor} r g b / 30%);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control {
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-color: ${passColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-line-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([selected]) .control {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: rgb(from ${borderHoverColor} r g b / 30%);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            height: 32px;
            width: 32px;
            border-style: solid;
            border-radius: 100%;
            border-color: var(--ni-private-step-icon-border-color);
            border-width: 1px;
            background-image: radial-gradient(
                closest-side,
                ${'' /* Workaround to prevent aliasing on radial-gradient boundaries, see:
                        https://frontendmasters.com/blog/obsessing-over-smooth-radial-gradient-disc-edges
                    */}
                var(--ni-private-step-icon-background-color) calc(100% - 1px/var(--ni-private-device-resolution)),
                transparent 100%
            );
            background-origin: border-box;
            background-size: var(--ni-private-step-icon-background-size);
            background-repeat: no-repeat;
            background-position: center center;
            position: relative;
            transition:
                border-color ${smallDelay} ease-in-out,
                border-width ${smallDelay} ease-in-out,
                background-size ${smallDelay} ease-out;
        }

        :host([selected]) .icon {
            border-width: 2px;
        }

        .icon::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            outline-color: var(--ni-private-step-icon-outline-inset-color);
            outline-style: solid;
            outline-width: 0px;
            outline-offset: 0px;
            border: 1px solid transparent;
            border-radius: 100%;
            color: transparent;
            background-clip: border-box;
            transition:
                outline-color ${smallDelay} ease-in-out,
                outline-width ${smallDelay} ease-in-out,
                outline-offset ${smallDelay} ease-in-out;
        }

        .content {
            display: inline-flex;
            width: 100%;
            flex-direction: column;
            padding-top: ${smallPadding};
        }

        .title-wrapper {
            display: inline-flex;
            height: ${controlSlimHeight};
            flex-direction: row;
            align-items: center;
            justify-content: start;
            gap: ${smallPadding};
            font: ${bodyFont};
        }

        [part='start'] {
            display: none;
        }

        .title {
            display: inline-block;
            flex: none;
        }

        [part='end'] {
            display: none;
        }
        
        .line {
            display: inline-block;
            flex: 1;
            height: 1px;
            background: var(--ni-private-step-line-color);
            transform: scale(1, 1);
            transition:
                background-color ${smallDelay} ease-in-out,
                transform ${smallDelay} ease-in-out;
        }

        .subtitle {
            font: ${errorTextFont};
        }
    }

    @layer hover {
        .control:hover {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        :host([severity="error"]) .control:hover {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control:hover {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control:hover {
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${passColor};
        }

        :host([selected]) .control:hover {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .control:hover .icon {
            border-width: 2px;
        }

        .control:hover .line {
            transform: scale(1, 2);
        }
    }

    @layer focusVisible {
        .control${focusVisible} {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-outline-inset-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        :host([severity="error"]) .control${focusVisible} {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-icon-outline-inset-color: ${failColor};
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control${focusVisible} {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-icon-outline-inset-color: ${warningColor};
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control${focusVisible} {
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-icon-outline-inset-color: transparent;
            --ni-private-step-line-color: ${passColor};
        }

        :host([selected]) .control${focusVisible} {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-icon-outline-inset-color: ${borderHoverColor};
            --ni-private-step-line-color: ${borderHoverColor};
        }
    
        .control${focusVisible} .icon {
            border-width: 2px;
        }

        .control${focusVisible} .icon::before {
            outline-width: ${borderWidth};
            outline-offset: -2px;
        }

        .control${focusVisible} .line {
            transform: scale(1, 2);
        }
    }

    @layer active {
        .control:active {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: ${fillSelectedColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        :host([severity="error"]) .control:active {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-color: rgb(from ${failColor} r g b / 30%);
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control:active {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-color: rgb(from ${warningColor} r g b / 30%);
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control:active {
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-color: rgb(from ${passColor} r g b / 30%);
            --ni-private-step-line-color: ${passColor};
        }

        :host([selected]) .control:active { 
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: rgb(from ${borderHoverColor} r g b / 30%);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .control:active .icon {
            border-width: 2px;
        }

        .control:active .icon::before {
            outline-width: 0px;
            outline-offset: 0px;
        }

        .control:active .line {
            transform: scale(1, 1);
        }
    }

    @layer disabled {

    }

    @layer top {
        @media (prefers-reduced-motion) {
            .control {
                transition-duration: 0s;
            }
        }
    }
`;

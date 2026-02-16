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
            --ni-private-step-icon-background-color: rgba(${borderRgbPartialColor}, 0.1);
            --ni-private-step-icon-background-size: 100% 100%;
            ${'' /* 6px = (2px icon border + 1px inset) * 2 sides */}
            --ni-private-step-icon-background-inset-size: calc(100% - 6px) calc(100% - 6px);
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
        }

        .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            height: 32px;
            width: 32px;
            border: 2px solid transparent;
            border-radius: 100%;
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
                box-shadow ${smallDelay} ease-in-out,
                border-color ${smallDelay} ease-in-out,
                background-size ${smallDelay} ease-in-out;
        }

        .icon::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            outline: 0px solid transparent;
            outline-offset: 0px;
            border: 1px solid transparent;
            border-radius: 100%;
            color: transparent;
            background-clip: border-box;
            transition:
                outline-offset ${smallDelay} ease-in-out,
                outline ${smallDelay} ease-in-out;
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
            background: rgba(${borderRgbPartialColor}, 0.1);
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
        .control:hover .icon {
            border-color: ${borderHoverColor};
            background-size: var(--ni-private-step-icon-background-inset-size);
        }

        .control:hover .line {
            background-color: ${borderHoverColor};
            transform: scale(1, 2);
        }
    }

    @layer focusVisible {
        .control${focusVisible} .icon {
            border-color: ${borderHoverColor};
            background-size: var(--ni-private-step-icon-background-inset-size);
        }

        .control${focusVisible} .icon::before {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -2px;
        }

        .control${focusVisible} .line {
            background-color: ${borderHoverColor};
            transform: scale(1, 2);
        }
    }

    @layer active {
        .control:active .icon {
            border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: ${fillSelectedColor};
            background-size: var(--ni-private-step-icon-background-size);
        }

        .control:active .icon::before {
            outline: 0px solid transparent;
            outline-offset: 0px;
        }

        .control:active .line {
            background-color: ${borderHoverColor};
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

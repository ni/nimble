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
} from '../../theme-provider/design-tokens';
import { styles as severityStyles } from '../severity/styles';
import { focusVisible } from '../../utilities/style/focus';

// import { accessiblyHidden } from '../../utilities/style/accessibly-hidden';

export const styles = css`
    @layer base, checked, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-flex')}
        ${severityStyles}
        :host {
            height: 46px;
            color: ${buttonLabelFontColor};
            font: ${buttonLabelFont};
            white-space: nowrap;
            outline: none;
            border: 1px solid red;
        }

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
                rgba(${borderRgbPartialColor}, 0.1) calc(100% - 1px/var(--ni-private-device-resolution)),
                transparent 100%
            );
            background-origin: border-box;
            background-size: 100% 100%;
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
            border: 1px solid transparent;
            border-radius: 100%;
            color: transparent;
            background-clip: border-box;
            transition: outline ${smallDelay} ease-in-out;
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
            background: green;
        }

        .subtitle {
            font: ${errorTextFont};
        }
    }

    @layer hover {
        .control:hover .icon {
            border-color: ${borderHoverColor};
            background-size: calc(100% - 6px) calc(100% - 6px);
        }
    }

    @layer focusVisible {
        .control${focusVisible} .icon {
            border-color: ${borderHoverColor};
            background-size: calc(100% - 6px) calc(100% - 6px);
        }

        .control${focusVisible} .icon::before {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -2px;
        }
    }

    @layer active {
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

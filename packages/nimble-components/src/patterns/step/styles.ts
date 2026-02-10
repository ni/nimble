import { css } from '@ni/fast-element';
import { display } from '../../utilities/style/display';
import {
    buttonLabelFont,
    buttonLabelFontColor,
    smallPadding,
    bodyFont,
    errorTextFont,
    controlSlimHeight,
} from '../../theme-provider/design-tokens';
import {styles as severityStyles} from '../severity/styles';

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
            font: inherit;
            color: inherit;
            background-color: transparent;
            gap: ${smallPadding};
            cursor: pointer;
            outline: none;
            margin: 0; 
            padding: 0 ${smallPadding} 0 0;
            position: relative;
        }

        .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 32px;
            border: 1px solid purple;
            flex: none;
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
    }

    @layer focusVisible {
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

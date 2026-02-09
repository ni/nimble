import { css } from '@ni/fast-element';
import { display } from '../../utilities/style/display';
import {
    buttonLabelFont,
    buttonLabelFontColor,
    smallPadding,
    bodyFont,
    errorTextFont,
} from '../../theme-provider/design-tokens';

// import { accessiblyHidden } from '../../utilities/style/accessibly-hidden';

export const styles = css`
    @layer base, checked, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-flex')}

        :host {
            height: 46px;
            color: ${buttonLabelFontColor};
            font: ${buttonLabelFont};
            white-space: nowrap;
            outline: none;
            border: 1px solid red;
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
        }

        .content {
            display: inline-flex;
            flex-direction: column;
            gap: ${smallPadding};
            padding-top: ${smallPadding};
        }

        .title {
            display: inline-flex;
            font: ${bodyFont};
        }

        [part='start'] {
            display: none;
        }

        [part='end'] {
            display: none;
        }
        
        .line {
            display: block;
            height: 5px;
            border: 1px solid green;
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

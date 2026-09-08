import { css } from '@ni/fast-element';
import {
    borderHoverColor,
    dividerBackgroundColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active;

    @layer base {
        ${display('block')}

        :host {
            position: relative;
            flex: 0 0 2px;
            width: 2px;
            height: 100%;
            min-height: 0;
            background: ${dividerBackgroundColor};
        }

        .splitter {
            position: absolute;
            inset: 0 -8px 0 -2px;
            cursor: col-resize;
            touch-action: none;
            user-select: none;
            -webkit-user-select: none;
            outline: none;
        }
    }

    @layer hover {
        :host(:hover) {
            background: ${borderHoverColor};
        }
    }

    @layer focusVisible {
        .splitter:focus-visible::before {
            content: '';
            position: absolute;
            z-index: 1;
            inset-block: 0;
            inset-inline-start: 3px;
            width: 3px;
            transform: translateX(-50%);
            background: ${borderHoverColor};
            pointer-events: none;
        }
    }

    @layer active {
        :host(:has(.resizing)) {
            background: ${borderHoverColor};
        }
    }
`;
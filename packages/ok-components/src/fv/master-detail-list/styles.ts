import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    placeholderFontColor,
    smallDelay,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible;

    @layer base {
        ${display('block')}

        :host {
            color: ${bodyFontColor};
            font: ${bodyFont};
        }

        .master-detail-list {
            display: flex;
            flex-direction: column;
            min-block-size: 0;
        }

        .filter-row {
            padding: ${standardPadding};
            padding-block-end: 10px;
        }

        .filter-input {
            -webkit-appearance: none;
            appearance: none;
            inline-size: 100%;
            padding: 10px 2px 12px;
            font: inherit;
            color: inherit;
            border: none;
            border-bottom: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.35);
            background: transparent;
            outline: none;
            transition: border-color ${smallDelay} ease-in-out;
        }

        .filter-input::placeholder {
            color: ${placeholderFontColor};
        }

        .items {
            display: block;
            min-block-size: 0;
            overflow: auto;
        }

        .empty-state {
            padding: 18px;
            color: ${placeholderFontColor};
        }
    }

    @layer hover {
        .filter-input:hover {
            border-bottom-color: ${borderHoverColor};
        }
    }

    @layer focusVisible {
        .filter-input:focus-visible {
            border-bottom-color: ${borderHoverColor};
        }
    }
`;
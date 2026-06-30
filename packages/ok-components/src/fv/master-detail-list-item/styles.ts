import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    fillHoverColor,
    fillSelectedColor,
    iconColor,
    placeholderFontColor,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, selected;

    @layer base {
        ${display('block')}

        :host {
            position: relative;
            color: ${bodyFontColor};
            cursor: pointer;
            user-select: none;
        }

        :host([hidden]) {
            display: none;
        }

        .item {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: ${standardPadding};
            min-block-size: 76px;
            padding: 14px 18px 14px 22px;
            background: transparent;
        }

        :host([compact]) .item {
            min-block-size: 56px;
            padding: 10px 18px 10px 22px;
        }

        .text {
            min-inline-size: 0;
        }

        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font: ${bodyFont};
            font-weight: 600;
            color: ${bodyFontColor};
        }

        .subtitle {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-block-start: 4px;
            font: ${bodyFont};
            color: ${placeholderFontColor};
        }

        :host([compact]) .subtitle {
            margin-block-start: 2px;
        }

        .status {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            inline-size: 16px;
            block-size: 16px;
            flex: 0 0 auto;
        }

        .status-icon {
            inline-size: 10px;
            block-size: 10px;
            color: currentColor;
            ${iconColor.cssCustomProperty}: currentColor;
        }
    }

    @layer hover {
        :host(:hover) .item {
            background: ${fillHoverColor};
        }
    }

    @layer selected {
        :host([selected]) .item {
            background: ${fillSelectedColor};
        }

        :host([selected])::before {
            content: '';
            position: absolute;
            inset-block: 0;
            inset-inline-start: 0;
            inline-size: calc(${borderWidth} * 4);
            background: ${borderHoverColor};
        }
    }
`;
import { Behavior, css } from '@microsoft/fast-element';
import {
    actionColorRgbPartial,
    borderColorHover,
    borderColorRgbPartial,
    fillColorSelected
} from '../../theme-provider/design-tokens';
import { appearanceBehavior } from '../../utilities/style/appearance';
import { focusVisible } from '../../utilities/style/focus';
import { ButtonAppearance } from './types';

export const outlineAppearanceCss = css`
    .control {
        background-color: transparent;
        border-color: rgba(${actionColorRgbPartial}, 0.3);
    }

    .control:hover {
        background-color: transparent;
        border-color: ${borderColorHover};
    }

    .control${focusVisible} {
        background-color: transparent;
        border-color: ${borderColorHover};
    }

    .control:active {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }

    .control[disabled] {
        background-color: transparent;
        border-color: rgba(${borderColorRgbPartial}, 0.2);
    }
`;

export const ghostAppearanceCss = css`
    .control {
        background-color: transparent;
        border-color: transparent;
    }

    .control:hover {
        background-color: transparent;
        border-color: ${borderColorHover};
    }

    .control${focusVisible} {
        background-color: transparent;
        border-color: ${borderColorHover};
    }

    .control:active {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }

    .control[disabled] {
        background-color: transparent;
        border-color: transparent;
    }
`;

export const blockAppearanceCss = css`
    .control {
        background-color: rgba(${borderColorRgbPartial}, 0.1);
        border-color: transparent;
    }

    .control:hover {
        background-color: rgba(${borderColorRgbPartial}, 0.1);
        border-color: ${borderColorHover};
    }

    .control${focusVisible} {
        background-color: rgba(${borderColorRgbPartial}, 0.1);
        border-color: ${borderColorHover};
    }

    .control:active {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }

    .control[disabled] {
        background-color: rgba(${borderColorRgbPartial}, 0.1);
        border-color: transparent;
    }
`;

// prettier-ignore
export const buttonAppearanceBehaviors: Behavior[] = [
    appearanceBehavior(ButtonAppearance.Outline, outlineAppearanceCss),
    appearanceBehavior(ButtonAppearance.Ghost, ghostAppearanceCss),
    appearanceBehavior(ButtonAppearance.Block, blockAppearanceCss)
];

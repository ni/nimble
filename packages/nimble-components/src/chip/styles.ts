import { css } from '@ni/fast-element';
import {
    actionRgbPartialColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    iconColor,
    iconSize,
    mediumPadding,
    smallPadding
} from '../theme-provider/design-tokens';
import { display } from '../utilities/style/display';
import { appearanceBehavior } from '../utilities/style/appearance';
import { ChipAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        width: fit-content;
        max-width: 300px;
        color: ${bodyFontColor};
        font: ${bodyFont};
        padding: 0 ${mediumPadding};
        gap: 4px;
        background-color: transparent;
        border: ${borderWidth} solid rgba(${actionRgbPartialColor}, 0.3);
        border-radius: 4px;
        justify-content: center;
        align-items: center;
    }

    :host([disabled]) {
        cursor: default;
        color: ${bodyDisabledFontColor};
        border-color: rgba(${borderRgbPartialColor}, 0.3);
    }

    :host([disabled]) slot[name='start']::slotted(*) {
        opacity: 0.3;
        ${iconColor.cssCustomProperty}: ${bodyFontColor};
    }

    slot[name='start']::slotted(*) {
        flex-shrink: 0;
    }

    [part='start'] {
        display: contents;
        ${iconColor.cssCustomProperty}: ${bodyFontColor};
    }

    .content {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .remove-button {
        height: ${iconSize};
        width: ${iconSize};
        margin-right: calc(-1 * ${smallPadding});
    }

    [part='end'] {
        display: none;
    }
`.withBehaviors(
    appearanceBehavior(
        ChipAppearance.block,
        css`
            :host,
            :host([disabled]) {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                border-color: transparent;
            }
        `
    )
);

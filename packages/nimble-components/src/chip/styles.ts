import { css } from '@ni/fast-element';
import {
    actionRgbPartialColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    controlSlimHeight,
    iconColor,
    mediumPadding,
    smallDelay,
    smallPadding
} from '../theme-provider/design-tokens';
import { display } from '../utilities/style/display';
import { appearanceBehavior } from '../utilities/style/appearance';
import { focusVisible } from '../utilities/style/focus';
import { ChipAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        background-color: transparent;
        height: ${controlHeight};
        width: fit-content;
        color: ${bodyFontColor};
        font: ${bodyFont};
        padding: 0 ${mediumPadding};
        cursor: pointer;
        white-space: nowrap;
        outline: none;
        border: none;
        gap: 4px;
        background-color: transparent;
        border: ${borderWidth} solid transparent;
        border-radius: 4px;
        fill: inherit;
        align-items: center;
        justify-content: center;
        outline: none;
        position: relative;
        transition:
            box-shadow ${smallDelay} ease-in-out,
            border-color ${smallDelay} ease-in-out,
            background-size ${smallDelay} ease-in-out;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        ${
            /*
                Not sure why but this is needed to get buttons with icons and buttons
                without icons to align on the same line when the button is inline-flex
                See: https://github.com/ni/nimble/issues/503
            */ ''
        }
        vertical-align: middle;
    }

    :host::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        outline: 0px solid transparent;
        color: transparent;
        background-clip: border-box;
        transition: outline ${smallDelay} ease-in-out;
    }

    [part='start'] {
        display: contents;
        ${iconColor.cssCustomProperty}: ${bodyFontColor};
    }

    slot[name='start']::slotted(*) {
        flex-shrink: 0;
    }

    [part='end'] {
        display: contents;
        ${iconColor.cssCustomProperty}: ${bodyFontColor};
    }

    slot[name='end']::slotted(*) {
        flex-shrink: 0;
    }

    .remove-button {
        height: ${controlSlimHeight};
    }

    :host(:hover) {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    :host(${focusVisible}) {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    :host(${focusVisible})::before {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -3px;
    }

    :host([disabled]) {
        cursor: default;
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
        box-shadow: none;
        background-image: none;
        background-size: 100% 100%;
    }

    :host([disabled])::before {
        box-shadow: none;
    }

    :host([disabled]) slot[name='start']::slotted(*),
    :host([disabled]) slot[name='end']::slotted(*),
    :host([disabled]) .remove-button {
        opacity: 0.3;
        ${iconColor.cssCustomProperty}: ${bodyFontColor};
    }

    .content {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .remove-button {
        margin-right: calc(-1 * ${smallPadding});
    }
`.withBehaviors(
    appearanceBehavior(
        ChipAppearance.outline,
        css`
            :host {
                border-color: rgba(${actionRgbPartialColor}, 0.3);
            }

            :host([disabled]) {
                border-color: rgba(${borderRgbPartialColor}, 0.3);
            }
        `
    ),
    appearanceBehavior(
        ChipAppearance.block,
        css`
            :host {
                background-image: linear-gradient(
                    rgba(${borderRgbPartialColor}, 0.1),
                    rgba(${borderRgbPartialColor}, 0.1)
                );
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            :host(:hover) {
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            :host(${focusVisible}) {
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            :host([disabled]) {
                background-image: linear-gradient(
                    rgba(${borderRgbPartialColor}, 0.1),
                    rgba(${borderRgbPartialColor}, 0.1)
                );
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }
        `
    )
);

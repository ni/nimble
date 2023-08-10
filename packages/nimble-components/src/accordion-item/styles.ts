import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    actionRgbPartialColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    buttonLabelDisabledFontColor,
    failColor,
    iconColor,
    iconSize,
    smallDelay,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { AccordionAppearance } from '../accordion/types';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-flex')}

        :host {
            background-color: transparent;
            display: flex;
            box-sizing: border-box;
            flex-direction: column;
            line-height: ${standardPadding};
            margin: 2px;
            border: 0px solid transparent;
            pointer-events: none;
        }

        .details {
            display: flex;
            position: relative;
            transition: box-shadow ${smallDelay} ease-in-out;
        }

        .heading {
            display: contents;
            width: 100%;
            pointer-events: all;
        }

        slot[name='heading']::slotted(*) {
            display: flex;
            justify-content: space-between;
            flex-direction: unset;
            width: 100%;
        }

        .button {
            display: flex;
            appearance: none;
            border: none;
            background: none;
            padding: 3px;
            column-gap: 8px;
            outline: none;
            text-align: left;
            cursor: pointer;
            font: inherit;
            color: inherit;
            width: 100%;
            background-color: transparent;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            box-sizing: border-box;
            transition: background-size ${smallDelay} ease-in-out;
        }

        .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            width: 100%;
            cursor: pointer;
            box-sizing: border-box;
            pointer-events: none;
            transition: box-shadow ${smallDelay} ease-in-out,
                outline ${smallDelay} ease-in-out;
        }

        :host([error-visible]) .button::before {
            box-shadow: 0px 0px 0px ${borderWidth} ${failColor} inset;
        }

        .region {
            font: ${bodyFont};
            color: ${bodyFontColor};
            gap: 13px;
            padding-top: 4px;
            padding-bottom: 5px;
            padding-left: 38px;
            padding-right: 4px;
            pointer-events: all;
        }

        :host([expanded]) .region {
            display: flex;
            color: black;
        }

        .region::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            width: 100%;
            cursor: pointer;
            box-sizing: border-box;
            pointer-events: none;
            transition: box-shadow ${smallDelay} ease-in-out;
        }

        .icon {
            display: flex;
            position: relative;
            background: none;
            border: none;
            outline: none;
            padding: 0px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            padding-top: 4.5px;
            padding-bottom: 5.5px;
            pointer-events: none;
        }

        slot[name='collapsed-icon'] {
            display: flex;
            padding-left: 13px;
        }

        slot[name='collapsed-icon'] svg {
            width: ${iconSize};
            height: ${iconSize};
            fill: ${iconColor};
        }

        :host([expanded]) slot[name='collapsed-icon'] {
            display: none;
        }

        slot[name='expanded-icon'] {
            display: none;
        }

        :host([expanded]) slot[name='expanded-icon'] {
            display: flex;
            padding-left: 13px;
        }

        :host([expanded]) slot[name='expanded-icon'] svg {
            width: ${iconSize};
            height: ${iconSize};
            fill: ${iconColor};
        }

        .heading-content {
            width: 100%;
            padding-left: 0px;
            padding-top: 4px;
            padding-bottom: 6px;
        }

        .error-icon svg {
            width: ${iconSize};
            height: ${iconSize};
        }

        :host([error-visible]) .error-icon {
            padding-right: 13px;
            ${iconColor.cssCustomProperty}: ${failColor};
        }
    }

    @layer hover {
        .button:hover::before {
            box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset;
        }

        .region:hover::before {
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        }
    }

    @layer focusVisible {
        .button${focusVisible}::before {
            box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset;
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -4px;
        }

        :host([error-visible]) .button${focusVisible}::before {
            box-shadow: 0px 0px 0px 2px ${failColor} inset;
            outline: ${borderWidth} solid ${failColor};
        }
    }

    @layer active {
        .button:active::before {
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
            outline: none;
        }
    }

    @layer disabled {
        :host([disabled]) .button {
            color: ${buttonLabelDisabledFontColor};
            cursor: default;
            pointer-events: none;
        }

        :host([disabled]) .button::before {
            box-shadow: none;
            outline: none;
        }
        /* Classes below added to prevent info from displaying if user sets "expanded" in dev tools*/
        :host([expanded][disabled]) .region {
            display: none;
        }

        :host([expanded][disabled]) slot[name='collapsed-icon'] {
            display: flex;
        }

        :host([disabled]) slot[name='collapsed-icon'] svg {
            fill: ${buttonLabelDisabledFontColor};
        }

        :host([expanded][disabled]) slot[name='expanded-icon'] {
            display: none;
        }
    }

    @layer top {
        /* Styling for rows of content inside of an accordion item */
        ::slotted(*) {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 18px;
        }
    }
`.withBehaviors(
    appearanceBehavior(
        AccordionAppearance.outline,
        css`
            @layer base {
                :host([expanded]) .details {
                    box-shadow: 0px 0px 0px ${borderWidth}
                        rgba(${actionRgbPartialColor}, 0.3) inset;
                }

                .button {
                    box-shadow: 0px 0px 0px ${borderWidth}
                        rgba(${actionRgbPartialColor}, 0.3) inset;
                }

                :host([expanded]) .button {
                    box-shadow: none;
                }
            }
        `
    ),
    appearanceBehavior(AccordionAppearance.ghost, css``),
    appearanceBehavior(
        AccordionAppearance.block,
        css`
            @layer base {
                .button {
                    background-image: linear-gradient(
                        rgba(${actionRgbPartialColor}, 0.1),
                        rgba(${actionRgbPartialColor}, 0.1)
                    );
                    background-size: 100% 100%;
                }
            }

            @layer hover {
                .button:hover {
                    background-image: linear-gradient(
                        rgba(${actionRgbPartialColor}, 0.1),
                        rgba(${actionRgbPartialColor}, 0.1)
                    );
                    background-size: calc(100% - 6px) calc(100% - 6px);
                }
            }

            @layer focusVisible {
                .button${focusVisible} {
                    background-image: linear-gradient(
                        rgba(${actionRgbPartialColor}, 0.1),
                        rgba(${actionRgbPartialColor}, 0.1)
                    );
                    background-size: calc(100% - 6px) calc(100% - 6px);
                }

                :host([expanded]) .button${focusVisible} {
                    background-position: bottom;
                    background-image: linear-gradient(
                        rgba(${actionRgbPartialColor}, 0.1),
                        rgba(${actionRgbPartialColor}, 0.1)
                    );
                    background-size: calc(100% - 6px) calc(100% - 3px);
                }
            }

            @layer active {
                .button:active {
                    background-image: linear-gradient(
                        rgba(${actionRgbPartialColor}, 0.1),
                        rgba(${actionRgbPartialColor}, 0.1)
                    );
                    background-size: calc(100% - 4px) calc(100% - 4px);
                }
            }

            @layer disabled {
                :host([disabled]) .button {
                    background-image: linear-gradient(
                        rgba(${actionRgbPartialColor}, 0.1),
                        rgba(${actionRgbPartialColor}, 0.1)
                    );
                    background-size: 100% 100%;
                    border-color: rgba(${actionRgbPartialColor}, 0.1);
                }
            }
        `
    )
);

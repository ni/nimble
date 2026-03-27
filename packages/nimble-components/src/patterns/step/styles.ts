import { css } from '@ni/fast-element';
import { Black15, Black91, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
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
    fillSelectedColor,
    passColor,
    failColor,
    warningColor,
    buttonLabelDisabledFontColor,
    iconColor,
    standardPadding,
    controlHeight,
    errorTextFontLineHeight,
} from '../../theme-provider/design-tokens';
import { styles as severityStyles } from '../severity/styles';
import { focusVisible } from '../../utilities/style/focus';
import { userSelectNone } from '../../utilities/style/user-select';
import { themeBehavior } from '../../utilities/style/theme';
import { Theme } from '../../theme-provider/types';
import { accessiblyHidden } from '../../utilities/style/accessibly-hidden';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-flex')}
        ${severityStyles}
        :host {
            color: ${buttonLabelFontColor};
            font: ${buttonLabelFont};
            white-space: nowrap;
            outline: none;
            border: none;
        }

        ${'' /* Container wrapper for severity text to position against */}
        .container {
            display: inline-flex;
            width: 100%;
            height: 100%;
            position: relative;
            list-style: none;
            --ni-private-step-content-height: calc(${smallPadding} + ${controlSlimHeight} + ${errorTextFontLineHeight});
            --ni-private-step-content-offset: calc(${controlHeight} + ${smallPadding});
        }

        .control {
            display: inline-grid;
            height: 100%;
            width: 100%;
            grid-template-areas:
                "icon top-spacer top-spacer"
                "icon title line"
                "icon subtitle subtitle";
            grid-template-columns:
                ${controlHeight} ${'' /* Icon width */}
                min-content ${'' /* Show the full title and subtitle */}
                1fr; ${'' /* Line is only fr unit so fills remaining space */}
            grid-template-rows:
                ${smallPadding}
                ${controlSlimHeight}
                min-content;
            column-gap: 4px;

            align-items: start;
            margin: 0;
            padding: 0;
            color: inherit;
            background-color: transparent;
            cursor: pointer;
            outline: none;
            --ni-private-step-icon-background-full-size: scale(1,1);
            ${'' /* (32px - 2 * (2px focus border + 1px inset gap)) / 32px = .8125 */}
            --ni-private-step-icon-background-inset-size: scale(0.8125, 0.8125);
            --ni-private-step-icon-background-none-size: scale(0,0);

            --ni-private-step-icon-color: ${buttonLabelFontColor};
            --ni-private-step-icon-border-color: transparent;
            --ni-private-step-icon-border-width: 1px;
            --ni-private-step-icon-background-color: rgba(${borderRgbPartialColor}, 0.1);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-icon-outline-inset-color: transparent;
            --ni-private-step-line-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        .container.last .control {
            grid-template-areas:
                "icon top-spacer"
                "icon title"
                "icon subtitle";
            grid-template-columns:
                ${controlHeight}
                min-content;
            grid-template-rows:
                ${smallPadding}
                ${controlSlimHeight}
                min-content;
        }

        .container.vertical .control {
            ${''/*
            Defines an interaction area clip-path that leaves out the severity text so it is easily selectable:
            1----------------2
            |    title       |
            |    subtitle    |
            |  4-------------3
            |  | severity-text
            |  |
            6--5
            */}
            clip-path: polygon(
                0% 0%,
                100% 0%,
                100% var(--ni-private-step-content-height),
                var(--ni-private-step-content-offset) var(--ni-private-step-content-height),
                var(--ni-private-step-content-offset) 100%,
                0% 100%
            );
            grid-template-areas:
                "icon top-spacer"
                "icon title"
                "icon subtitle"
                "line subtitle"
                "line .";
            grid-template-columns:
                ${controlHeight}
                min-content;
            grid-template-rows:
                ${smallPadding}
                ${controlSlimHeight}
                calc(${controlHeight} - ${smallPadding} - ${controlSlimHeight})
                min-content
                1fr;
        }

        .container.vertical.last .control {
            grid-template-areas:
                "icon top-spacer"
                "icon title"
                "icon subtitle";
            grid-template-columns:
                ${controlHeight}
                min-content;
            grid-template-rows:
                ${smallPadding}
                ${controlSlimHeight}
                min-content;
        }

        :host([severity="error"]) .control {
            --ni-private-step-icon-color: ${failColor};
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-color: rgb(from ${failColor} r g b / 30%);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control {
            --ni-private-step-icon-color: ${warningColor};
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-color: rgb(from ${warningColor} r g b / 30%);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control {
            --ni-private-step-icon-color: var(--ni-private-step-icon-inverse-color);
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-color: ${passColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-line-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([selected]) .control {
            --ni-private-step-icon-color: ${borderHoverColor};
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: rgb(from ${borderHoverColor} r g b / 30%);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .icon-background {
            grid-area: icon;
            display: inline-block;
            height: ${controlHeight};
            width: ${controlHeight};
            ${userSelectNone};
            background-color:  var(--ni-private-step-icon-background-color);
            transform: var(--ni-private-step-icon-background-size);
            border: none;
            border-radius: 100%;
            transition:
                transform ${smallDelay} ease-in-out;
        }

        .icon {
            grid-area: icon;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            height: ${controlHeight};
            width: ${controlHeight};
            ${userSelectNone};
            font: ${buttonLabelFont};
            color: var(--ni-private-step-icon-color);
            ${iconColor.cssCustomProperty}: var(--ni-private-step-icon-color);
            border: none;
            border-radius: 100%;
            box-shadow: inset 0px 0px 0px var(--ni-private-step-icon-border-width) var(--ni-private-step-icon-border-color);
            position: relative;
            transition:
                border-color ${smallDelay} ease-in-out,
                box-shadow ${smallDelay} ease-in-out;
        }

        :host([selected]) .icon {
            --ni-private-step-icon-border-width: 2px;
        }

        .icon::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            outline-color: var(--ni-private-step-icon-outline-inset-color);
            outline-style: solid;
            outline-width: 0px;
            outline-offset: 0px;
            border: none;
            border-radius: 100%;
            color: transparent;
            transition:
                outline-color ${smallDelay} ease-in-out,
                outline-width ${smallDelay} ease-in-out,
                outline-offset ${smallDelay} ease-in-out;
        }

        .current-label {
            ${accessiblyHidden}
        }

        .step-indicator {
            display: contents;
        }

        :host([severity="error"]) .step-indicator,
        :host([severity="warning"]) .step-indicator,
        :host([severity="success"]) .step-indicator {
            display: none;
        }

        :host([selected]) .step-indicator,
        :host([disabled]) .step-indicator {
            display: contents;
        }

        .icon-severity {
            display: none;
        }

        :host([severity="error"]) .icon-severity,
        :host([severity="warning"]) .icon-severity,
        :host([severity="success"]) .icon-severity {
            display: contents;
        }

        :host([selected]) .icon-severity,
        :host([disabled]) .icon-severity {
            display: none;
        }

        .top-spacer {
            grid-area: top-spacer;
            height: ${smallPadding};
        }

        .title {
            grid-area: title;
            min-width: min-content;
            height: ${controlSlimHeight};
            display: inline-block;
            align-content: center;
            font: ${bodyFont};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        [part='start'] {
            display: none;
        }

        [part='end'] {
            display: none;
        }

        .line {
            grid-area: line;
            align-self: center;
            justify-self: center;
            display: inline-block;
            width: 100%;
            min-width: ${standardPadding};
            height: 1px;
            min-height: 1px;
            background: var(--ni-private-step-line-color);
            background-clip: content-box;
            transform: scale(1, 1);
            transition:
                background-color ${smallDelay} ease-in-out,
                transform ${smallDelay} ease-in-out;
        }

        .container.last .line {
            display: none;
        }

        .container.vertical .line {
            width: 1px;
            min-width: 1px;
            height: 100%;
            padding-top: ${smallPadding};
            min-height: ${standardPadding};
        }

        .subtitle {
            grid-area: subtitle;
            display: inline-block;
            min-width: min-content;
            height: ${errorTextFontLineHeight};
            align-content: center;
            font: ${errorTextFont};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .severity-text {
            left: 0px;
            top: var(--ni-private-step-content-height);
        }

        .container.vertical .severity-text {
            width: calc(100% - var(--ni-private-step-content-offset));
            left: var(--ni-private-step-content-offset);
        }
    }

    @layer hover {
        .control:hover {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        :host([severity="error"]) .control:hover {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control:hover {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control:hover {
            --ni-private-step-icon-color: var(--ni-private-step-icon-inverse-color);
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${passColor};
        }

        :host([selected]) .control:hover {
            --ni-private-step-icon-color: ${buttonLabelFontColor};
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .control:hover .icon {
            --ni-private-step-icon-border-width: 2px;
        }

        .control:hover .line {
            transform: scale(1, 2);
        }

        .container.vertical .control:hover .line {
            transform: scale(2, 1);
        }
    }

    @layer focusVisible {
        .control${focusVisible} {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-outline-inset-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        :host([severity="error"]) .control${focusVisible} {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-icon-outline-inset-color: ${failColor};
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control${focusVisible} {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-icon-outline-inset-color: ${warningColor};
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control${focusVisible} {
            --ni-private-step-icon-color: var(--ni-private-step-icon-inverse-color);
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-inset-size);
            --ni-private-step-icon-outline-inset-color: transparent;
            --ni-private-step-line-color: ${passColor};
        }

        :host([selected]) .control${focusVisible} {
            --ni-private-step-icon-color: ${borderHoverColor};
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-none-size);
            --ni-private-step-icon-outline-inset-color: ${borderHoverColor};
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .control${focusVisible} .icon {
            --ni-private-step-icon-border-width: 2px;
        }

        .control${focusVisible} .icon::before {
            outline-width: ${borderWidth};
            ${'' /* -1px control to outline edge -2px focus border -1px inset gap */}
            outline-offset: -4px;
        }

        .control${focusVisible} .line {
            transform: scale(1, 2);
        }

        .container.vertical .control${focusVisible} .line {
            transform: scale(2, 1);
        }
    }

    @layer active {
        .control:active {
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: ${fillSelectedColor};
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        :host([severity="error"]) .control:active {
            --ni-private-step-icon-border-color: ${failColor};
            --ni-private-step-icon-background-color: rgb(from ${failColor} r g b / 30%);
            --ni-private-step-line-color: ${failColor};
        }

        :host([severity="warning"]) .control:active {
            --ni-private-step-icon-border-color: ${warningColor};
            --ni-private-step-icon-background-color: rgb(from ${warningColor} r g b / 30%);
            --ni-private-step-line-color: ${warningColor};
        }

        :host([severity="success"]) .control:active {
            --ni-private-step-icon-color: ${buttonLabelFontColor};
            --ni-private-step-icon-border-color: ${passColor};
            --ni-private-step-icon-background-color: rgb(from ${passColor} r g b / 30%);
            --ni-private-step-line-color: ${passColor};
        }

        :host([selected]) .control:active {
            --ni-private-step-icon-color: ${buttonLabelFontColor};
            --ni-private-step-icon-border-color: ${borderHoverColor};
            --ni-private-step-icon-background-color: rgb(from ${borderHoverColor} r g b / 30%);
            --ni-private-step-line-color: ${borderHoverColor};
        }

        .control:active .icon {
            --ni-private-step-icon-border-width: 2px;
        }

        .control:active .icon::before {
            outline-width: 0px;
            outline-offset: 0px;
        }

        .control:active .line {
            transform: scale(1, 1);
        }
    }

    @layer disabled {
        :host([disabled]) .control {
            cursor: default;
            color: ${buttonLabelDisabledFontColor};
            --ni-private-step-icon-color: rgb(from ${buttonLabelFontColor} r g b / 30%);
            --ni-private-step-icon-border-color: transparent;
            --ni-private-step-icon-background-color: rgba(${borderRgbPartialColor}, 0.1);
            --ni-private-step-icon-background-size: var(--ni-private-step-icon-background-full-size);
            --ni-private-step-icon-outline-inset-color: transparent;
            --ni-private-step-line-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([disabled]) .line {
            transform: scale(1, 1);
        }
    }

    @layer top {
        @media (prefers-reduced-motion) {
            .control {
                transition-duration: 0s;
            }
        }
    }
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            @layer base {
                .control {
                    --ni-private-step-icon-inverse-color: ${White};
                }
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            @layer base {
                .control {
                    --ni-private-step-icon-inverse-color: ${Black91};
                }
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            @layer base {
                .control {
                    --ni-private-step-icon-inverse-color: ${Black15};
                }

                :host([severity="success"]) .control {
                    --ni-private-step-icon-background-color: rgb(from ${passColor} r g b / 30%);
                }
            }
        `
    )
);

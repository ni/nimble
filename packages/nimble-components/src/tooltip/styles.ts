import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { BannerFail100DarkUi, Information100LightUi } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    popupBoxShadowColor,
    borderWidth,
    borderRgbPartialColor,
    tooltipBackgroundColor,
    standardPadding,
    smallPadding
} from '../theme-provider/design-tokens';
import { statesBehavior } from '../utilities/style/appearance';
import { TooltipAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont};
        color: ${tooltipCaptionFontColor};
        text-align: left;
        cursor: pointer;
    }

    .tooltip {
        box-sizing: border-box;
        flex-shrink: 0;
        max-width: 440px;

        box-shadow: 0px 3px 4px ${popupBoxShadowColor};

        display: inline-flex;
    }
`
    .withBehaviors(
        statesBehavior(
            TooltipAppearance.default,
            css`
                .tooltip {
                    border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
                    background-color: ${tooltipBackgroundColor};
                    padding-bottom: 6px;
                    padding-left: calc(${standardPadding} / 2);
                    padding-right: calc(${standardPadding} / 2);
                    padding-top: ${smallPadding};
                }
            `
        ),
        statesBehavior(
            TooltipAppearance.error,
            css`
                .tooltip {
                    border: ${borderWidth} solid ${BannerFail100DarkUi};
                    background-color: ${tooltipBackgroundColor};
                    padding-bottom: 6px;
                    padding-left: calc(${standardPadding} / 2);
                    padding-right: calc(${standardPadding} / 2);
                    padding-top: ${smallPadding};
                }
            `
        ),
        statesBehavior(
            TooltipAppearance.errorIcon,
            css`
                .tooltip {
                    border: ${borderWidth} solid ${BannerFail100DarkUi};
                    background-color: ${tooltipBackgroundColor};
                    padding-bottom: 6px;
                    padding-left: calc(${standardPadding} / 2);
                    padding-right: calc(${standardPadding} / 2);
                    padding-top: ${smallPadding};
                }
            `
        ),
        statesBehavior(
            TooltipAppearance.information,
            css`
                .tooltip {
                    border: ${borderWidth} solid ${Information100LightUi};
                    background-color: ${tooltipBackgroundColor};
                    padding-bottom: 6px;
                    padding-left: calc(${standardPadding} / 2);
                    padding-right: calc(${standardPadding} / 2);
                    padding-top: ${smallPadding};
                }
            `
        ),
        statesBehavior(
            TooltipAppearance.informationIcon,
            css`
                .tooltip {
                    border: ${borderWidth} solid ${Information100LightUi};
                    background-color: ${tooltipBackgroundColor};
                    padding-bottom: 6px;
                    padding-left: calc(${standardPadding} / 2);
                    padding-right: calc(${standardPadding} / 2);
                    padding-top: ${smallPadding};
                }
            `
        )
    );
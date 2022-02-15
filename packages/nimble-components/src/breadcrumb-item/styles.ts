import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    blockAppearanceCss,
    ghostAppearanceCss,
    outlineAppearanceCss
} from '../patterns/button/appearance-behaviors';
import {
    borderColorRgbPartial,
    borderWidth,
    contentFontColor,
    contentFontSize,
    controlHeight,
    fontFamily,
    hyperlinkColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { BreadcrumbItemAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
    }

    .listitem {
        padding-top: 4px;
        padding-bottom: 4px;
        line-height: 24px;
        padding-left: 6px;
        padding-right: 6px;
    }

    :host([href]) .listitem {
        padding-left: 0px;
        padding-right: 0px;
    }

    .separator nimble-arrow-expander-right-icon {
        position: relative;
        top: 4px;
    }

    .control {
        color: ${contentFontColor};
        cursor: default;
        border: ${borderWidth} solid transparent;
        border-color: transparent;
        padding: 4px ${standardPadding} 6px ${standardPadding};
    }

    .control:link {
        cursor: pointer;
        text-decoration: none;
    }

    .start,
    .end {
        display: flex;
    }

    .start {
        margin-inline-end: 6px;
    }
    .end {
        margin-inline-start: 6px;
    }
`
    // prettier-ignore
    .withBehaviors(
        appearanceBehavior(
            BreadcrumbItemAppearance.Hypertext,
            css`
                .control {
                    padding-left: 6px;
                    padding-right: 6px;
                }

                .control:link,
                .control:visited {
                    color: ${hyperlinkColor};
                }

                .control .content {
                    position: relative;
                }

                .control .content::before {
                    background: none;
                }

                .control:link .content::before {
                    content: '';
                    background: ${hyperlinkColor};
                    display: block;
                    height: 1px;
                    left: 0px;
                    position: absolute;
                    right: 0px;
                    top: calc(1em + 4px);
                    width: calc(100% - 2px);
                }

                .control[href]:hover .content::before {
                    margin-top: -1px;
                    height: 2px;
                }

                .control:visited .content::before {
                    background: ${hyperlinkColor};
                }
            `
        ),
        appearanceBehavior(
            BreadcrumbItemAppearance.HoverFill,
            css`
                .control {
                    padding-left: 6px;
                    padding-right: 6px;
                }

                .control:link,
                .control:visited {
                    color: ${contentFontColor};
                }

                .control:hover {
                    background-color: rgba(${borderColorRgbPartial}, 0.1);
                }

                .control:active {
                    background-color: rgba(${borderColorRgbPartial}, 0.2);
                }
            `
        ),
        appearanceBehavior(
            BreadcrumbItemAppearance.Outline,
            outlineAppearanceCss
        ),
        appearanceBehavior(BreadcrumbItemAppearance.Ghost, ghostAppearanceCss),
        appearanceBehavior(BreadcrumbItemAppearance.Block, blockAppearanceCss)
    );

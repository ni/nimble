import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    borderHoverColor,
    controlHeight,
    iconSize,
    linkActiveFontColor,
    linkDisabledFontColor,
    linkFont,
    linkFontColor,
    mediumPadding,
    placeholderFontColor
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    @layer base {
        ${display('inline-flex')}

        :host {
            height: ${controlHeight};

            ${
                /* When href removed the .control element is also removed
                so this becomes the fallback color for the slot */ ''
            }
            color: ${linkDisabledFontColor};
            font: ${linkFont};
        }

        .listitem {
            display: flex;
            align-items: center;
        }

        .control {
            color: ${linkFontColor};
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        [part='start'] {
            display: none;
        }

        [part='end'] {
            display: none;
        }

        .separator {
            padding-left: ${mediumPadding};
            padding-right: ${mediumPadding};
        }

        slot[name='separator'] {
            display: flex;
            align-items: center;
        }

        slot[name='separator'] svg {
            width: ${iconSize};
            height: ${iconSize};
            fill: ${placeholderFontColor};
        }
    }

    @layer hover {
        .control:any-link:hover {
            text-decoration: underline;
        }
    }

    @layer focusVisible {
        .control${focusVisible} {
            outline: none;
            box-shadow: inset 0px -1px;
            text-decoration: underline;
            color: ${borderHoverColor};
        }
    }

    @layer active {
        .control:active {
            color: ${linkActiveFontColor};
            text-decoration: underline;
            box-shadow: none;
        }
    }

    @layer disabled {
        .control:not(:any-link) {
            color: ${linkDisabledFontColor};
        }
    }
`;

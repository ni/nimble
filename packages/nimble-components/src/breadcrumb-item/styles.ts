import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    controlHeight,
    iconSize,
    linkDisabledFontColor,
    mediumPadding,
    placeholderFontColor
} from '../theme-provider/design-tokens';
import { styles as anchorStyles } from '../patterns/anchor/styles';

export const styles = css`
    ${anchorStyles}

    @layer base {
        ${display('inline-flex')}

        :host {
            height: ${controlHeight};
            padding-left: ${mediumPadding};

            ${
                /* When href removed the .control element is also removed
                so this becomes the fallback color for the slot */ ''
            }
            color: ${linkDisabledFontColor};
        }

        .listitem {
            display: flex;
            align-items: center;
        }

        .control {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: ${mediumPadding};
            text-decoration: none;
        }

        :host(:not([href])) slot:not([name]),
        :host([href='']) slot:not([name]) {
            display: block;
            margin-right: ${mediumPadding};
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
`;

import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';
import {
    bodyFont,
    bodyFontColor,
    buttonFillPrimaryColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
        margin: 10px;
        padding: 10px;
    }
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            :host {
                background-color: #f0f0f0;
                border: 2px solid #cccccc;
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                background-color: #333333;
                border: 2px solid #666666;
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                border: 2px solid ${buttonFillPrimaryColor};
                background-color: ${buttonFillPrimaryColor};
            }
        `
    )
);

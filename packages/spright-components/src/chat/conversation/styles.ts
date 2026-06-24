import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    borderWidth,
    dividerBackgroundColor,
    errorTextFont,
    sectionBackgroundImage,
    mediumPadding,
    standardPadding,
    placeholderFontColor,
    linkFont,
    linkFontColor,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        background: ${applicationBackgroundColor};
    }

    :host([appearance='overlay']) {
        background: none;
    }

    .toolbar {
        display: block;
    }

    .toolbar.toolbar-empty {
        display: none;
    }

    .start {
        display: block;
    }

    .start.start-empty {
        display: none;
    }

    .end {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 2px ${standardPadding};
        border-top: ${borderWidth} solid ${dividerBackgroundColor};
    }

    .end.end-empty {
        display: none;
    }

    ::slotted([slot="end"]) {
        font: ${errorTextFont};
        color: ${placeholderFontColor};
        ${linkFont.cssCustomProperty}: ${errorTextFont};
        ${linkFontColor.cssCustomProperty}: ${placeholderFontColor};
    }

    .messages {
        flex: 1;
        display: flex;
        flex-direction: column;
        row-gap: 32px;
        padding: ${mediumPadding} ${standardPadding} ${mediumPadding}
            ${standardPadding};
        background: ${sectionBackgroundImage};
        overflow-y: auto;
        overflow-anchor: none;
    }

    .messages-history,
    .messages-anchored {
        display: flex;
        flex-direction: column;
        row-gap: 32px;
    }

    .messages-history.region-empty {
        display: none;
    }

    .messages-anchored.anchor-active {
        min-height: 100%;
    }

    :host([appearance='overlay']) .messages {
        background: none;
    }

    .input {
        padding: ${borderWidth} ${standardPadding} ${standardPadding}
            ${standardPadding};
    }

    .input.input-empty {
        padding: 0px ${standardPadding} 0px ${standardPadding};
    }
`;

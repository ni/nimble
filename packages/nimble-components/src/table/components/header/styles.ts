import { css } from '@microsoft/fast-element';
import { display } from '../../../utilities/style/display';
import {
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconColor,
    mediumPadding,
    smallPadding,
    tableHeaderFont,
    tableHeaderFontColor
} from '../../../theme-provider/design-tokens';
import { focusVisible } from '../../../utilities/style/focus';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        align-items: center;
        padding-left: ${mediumPadding};
        padding-right: ${smallPadding};
        font: ${tableHeaderFont};
        color: ${tableHeaderFontColor};
        ${iconColor.cssCustomProperty}: ${tableHeaderFontColor};
        text-transform: uppercase;
        gap: ${smallPadding};
        cursor: default;
    }

    :host(.right-align) {
        flex-direction: row-reverse;
        padding-left: ${smallPadding};
        padding-right: ${mediumPadding};
    }

    :host(${focusVisible}) {
        outline: calc(2 * ${borderWidth}) solid ${borderHoverColor};
        outline-offset: calc(-2 * ${borderWidth});
    }

    .sort-indicator,
    .grouped-indicator {
        flex: 0 0 auto;
    }
`;

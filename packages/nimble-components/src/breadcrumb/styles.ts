import { css } from '@microsoft/fast-element';
import { DesignToken, display } from '@microsoft/fast-foundation';
import {
    DigitalGreenDark,
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    bodyEmphasizedFont,
    bodyFont,
    bodyFontColor
} from '../theme-provider/design-tokens';
import {
    getColorForTheme,
    hexToRgbaCssColor
} from '../theme-provider/theme-helpers';

export const breadcrumbActiveFontColor = DesignToken.create<string>(
    'ni-private-breadcrumb-active-font-color'
);

export const breadcrumb2FontColor = DesignToken.create<string>(
    'ni-private-breadcrumb-2-font-color'
);

export function getBreadcrumbActiveFontColorForTheme(
    element: HTMLElement
): string {
    return getColorForTheme(
        element,
        DigitalGreenDark,
        PowerGreen,
        hexToRgbaCssColor(White, 0.6)
    );
}

export function getBreadcrumb2FontColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, DigitalGreenDark, PowerGreen, PowerGreen);
}

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        --ni-private-breadcrumb-link-font-color: ${bodyFontColor};
        --ni-private-breadcrumb-link-active-font-color: ${breadcrumbActiveFontColor};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }

    :host(.style-2) {
        --ni-private-breadcrumb-link-font-color: ${breadcrumb2FontColor};
        --ni-private-breadcrumb-link-active-font-color: ${bodyFontColor};
    }

    ::slotted(*:first-child) {
        padding-left: 0px;
    }

    ::slotted(*:not([href]):last-child) {
        font: ${bodyEmphasizedFont};
    }
`;

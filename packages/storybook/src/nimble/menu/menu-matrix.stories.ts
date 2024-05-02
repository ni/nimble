import { html, ViewTemplate, when } from '@microsoft/fast-element';
import type { StoryFn, Meta } from '@storybook/html';
import { iconUserTag } from '@ni/nimble-components/dist/esm/icons/user';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { anchorMenuItemTag } from '@ni/nimble-components/dist/esm/anchor-menu-item';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

/* array of showSubMenu, childIcon, advancedSubMenu */
const subMenuStates = [
    [false, false, false],
    [true, false, false],
    [true, false, true],
    [true, true, false],
    [true, true, true]
] as const;
type SubMenuState = (typeof subMenuStates)[number];

const metadata: Meta = {
    title: 'Tests/Menu',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    parentIcon: IconVisibleState,
    [showSubMenu, childIcon, advancedSubMenu]: SubMenuState
): ViewTemplate => html`
    <span style="${() => (showSubMenu ? 'padding: 15px; padding-right: 200px; display:inline-flex;' : 'padding: 15px; display:inline-flex;')}">
        <${menuTag}>
            <header>Header</header>
            <${menuItemTag} ?expanded=${() => showSubMenu}>
                Item 1
                ${when(() => showSubMenu, html`
                    <${menuTag}>
                        ${when(() => advancedSubMenu, html`<header>Child header</header>`)}
                        <${menuItemTag}>Item 1.1</${menuItemTag}>
                        <${menuItemTag}>Item 1.2</${menuItemTag}>
                        ${when(() => advancedSubMenu, html`<hr>`)}
                        <${menuItemTag}>${when(() => childIcon, html`<${iconXmarkTag} slot="start"></${iconXmarkTag}>`)}Item 1.3</${menuItemTag}>
                        <${anchorMenuItemTag} href='#'>Anchor item 1.4</${anchorMenuItemTag}>
                        <${anchorMenuItemTag} href='#'>${when(() => childIcon, html`<${iconXmarkTag} slot="start"></${iconXmarkTag}>`)}Anchor item 1.5</${anchorMenuItemTag}>
                    </${menuTag}>
                `)}
            </${menuItemTag}>
            <hr>
            <${menuItemTag} disabled>${when(() => parentIcon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}Item 2</${menuItemTag}>
            <${menuItemTag}>${when(() => parentIcon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}Item 3</${menuItemTag}>
            <${menuItemTag} hidden>Item 4</${menuItemTag}>
            <${anchorMenuItemTag} href='#'>${when(() => parentIcon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}Anchor item</${anchorMenuItemTag}>
            <${anchorMenuItemTag}>Anchor item no href</${anchorMenuItemTag}>
            <${anchorMenuItemTag} href='#' disabled>${when(() => parentIcon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}Anchor item disabled</${anchorMenuItemTag}>
            <${anchorMenuItemTag} href='#' hidden>Anchor item hidden</${anchorMenuItemTag}>
        </${menuTag}>
    </span>
`;

export const menuThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [iconVisibleStates, subMenuStates])
);

export const hiddenMenu: StoryFn = createStory(
    hiddenWrapper(
        html`<${menuTag} hidden>
            <${menuItemTag}>Item 1</${menuItemTag}>
        </${menuTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html` <${menuTag}>
            Inner text
            <${menuItemTag}>Menu item</${menuItemTag}>
            <${anchorMenuItemTag}>Anchor menu item</${anchorMenuItemTag}>
        </${menuTag}>`
    )
);

import { html, ViewTemplate, when } from '@microsoft/fast-element';
import type { StoryFn, Meta } from '@storybook/html';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { menuTag } from '..';
import { iconUserTag } from '../../icons/user';
import { iconXmarkTag } from '../../icons/xmark';
import { menuItemTag } from '../../menu-item';
import { anchorMenuItemTag } from '../../anchor-menu-item';

const metadata: Meta = {
    title: 'Tests/Menu',
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        }
    }
};

export default metadata;

/* array of showSubMenu, childIcon, advancedSubMenu */
const subMenuStates = [
    [false, false, false],
    [true, false, false],
    [true, false, true],
    [true, true, false],
    [true, true, true]
] as const;
type SubMenuState = (typeof subMenuStates)[number];

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
            <${menuItemTag} disabled>Item 2</${menuItemTag}>
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

import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { createStory } from '../../utilities/tests/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { treeViewTag } from '..';
import { iconCogTag } from '../../icons/cog';
import { iconDatabaseTag } from '../../icons/database';
import { treeItemTag } from '../../tree-item';
import { anchorTreeItemTag } from '../../anchor-tree-item';

const expandedStates = [
    ['Collapsed', false],
    ['Expanded', true]
] as const;
type ExpandedState = (typeof expandedStates)[number];

const selectedStates = [
    ['Unselected', false],
    ['Selected', true]
] as const;
type SelectedState = (typeof selectedStates)[number];

const metadata: Meta = {
    title: 'Tests/Tree View',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [expandedName, expanded]: ExpandedState,
    [selectedName, selected]: SelectedState,
    iconVisible: IconVisibleState
): ViewTemplate => html`
    <${treeViewTag} style="padding: 10px">
        <${treeItemTag}
            ?expanded="${() => expanded}"
            ?disabled="${() => disabled}"
        >
            ${when(() => iconVisible, html`<${iconDatabaseTag} slot="start"></${iconDatabaseTag}>`)}
            ${() => expandedName} ${() => disabledName} ${() => selectedName}
            <${treeItemTag}
                ?disabled="${() => disabled}"
                ?selected="${() => selected}"
            >
            ${when(() => iconVisible, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                Nested Item 1
            </${treeItemTag}>
            <${treeItemTag} ?disabled="${() => disabled}">
            ${when(() => iconVisible, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                Nested Item 2
            </${treeItemTag}>
            <${anchorTreeItemTag} ?disabled="${() => disabled}" href="#">
            ${when(() => iconVisible, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                Nested Item 3 (link)
            </${anchorTreeItemTag}>
            <${treeItemTag} hidden>
                Nested Item 4
            </${treeItemTag}>
        </${treeItemTag}>
    </${treeViewTag}>
`;

export const treeViewThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        expandedStates,
        selectedStates,
        iconVisibleStates
    ])
);

export const hiddenTreeView: StoryFn = createStory(
    hiddenWrapper(
        html`<${treeViewTag} hidden>
            <${treeItemTag}>Item 1</${treeItemTag}>
        </${treeViewTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${treeViewTag}>
                Inner text
                <${treeItemTag}>Tree item</${treeItemTag}>
                <${anchorTreeItemTag}>Anchor tree item</${anchorTreeItemTag}>
            </${treeViewTag}>
        `
    )
);

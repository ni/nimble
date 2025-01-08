import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { iconCogTag } from '../../../../nimble-components/src/icons/cog';
import { iconDatabaseTag } from '../../../../nimble-components/src/icons/database';
import { treeItemTag } from '../../../../nimble-components/src/tree-item';
import { anchorTreeItemTag } from '../../../../nimble-components/src/anchor-tree-item';
import { treeViewTag } from '../../../../nimble-components/src/tree-view';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

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

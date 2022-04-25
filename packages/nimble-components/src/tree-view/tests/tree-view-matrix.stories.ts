import type { Story, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    ExpandedState,
    expandedStates,
    SelectedState,
    selectedStates,
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Tree View',
    parameters: {
        ...sharedMatrixParameters()
    }
};

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [expandedName, expanded]: ExpandedState,
    [selectedName, selected]: SelectedState,
    iconVisible: IconVisibleState
): ViewTemplate => html`
    <nimble-tree-view style="padding: 10px">
        <nimble-tree-item
            ?expanded="${() => expanded}"
            ?disabled="${() => disabled}"
        >
            ${when(() => iconVisible, html`<nimble-database-icon slot="start"></nimble-database-icon>`)}
            ${() => expandedName} ${() => disabledName} ${() => selectedName}
            <nimble-tree-item
                ?disabled="${() => disabled}"
                ?selected="${() => selected}"
            >
            ${when(() => iconVisible, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
                Nested Item 1
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
            ${when(() => iconVisible, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
                Nested Item 2
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
            ${when(() => iconVisible, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
                Nested Item 3
            </nimble-tree-item>
            <nimble-tree-item hidden>
                Nested Item 4
            </nimble-tree-item>
        </nimble-tree-item>
    </nimble-tree-view>
`;

export default metadata;

export const treeViewThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        expandedStates,
        selectedStates,
        iconVisibleStates
    ])
);

export const hiddenTreeView: Story = createStory(
    hiddenWrapper(
        html`<nimble-tree-view hidden>
            <nimble-tree-item>Item 1</nimble-tree-item>
        </nimble-tree-view>`
    )
);

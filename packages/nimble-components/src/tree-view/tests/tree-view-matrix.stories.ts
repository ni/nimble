import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import '..';
import '../../tree-item';
import '../../icons/database';
import '../../icons/cog';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState,
    ExpandedState,
    expandedStates,
    SelectedState,
    selectedStates,
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Tree View',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl: ''
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
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

export const treeViewThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            disabledStates,
            expandedStates,
            selectedStates,
            iconVisibleStates
        ])
    )
);

export const hiddenTreeView: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-tree-view hidden>
            <nimble-tree-item>Item 1</nimble-tree-item>
        </nimble-tree-view>`
    )
);

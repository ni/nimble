import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import '../index';
import '../../tree-item/index';
import {
    jobs16X16,
    notebook16X16
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState,
    ExpandedState,
    expandedStates,
    SelectedState,
    selectedStates
} from '../../tests/utilities/theme-test-helpers';

const metadata: Meta = {
    title: 'Tests/Tree View',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl: ''
        },
        controls: { hideNoControlsWarning: true }
    }
};

const component = (
    [disabledName, disabled]: DisabledState,
    [expandedName, expanded]: ExpandedState,
    [selectedName, selected]: SelectedState
): ViewTemplate => html`
    <nimble-tree-view>
        <nimble-tree-item
            ?expanded="${() => expanded}"
            ?disabled="${() => disabled}"
        >
            <span slot="start">${jobs16X16.data}</span>
            ${() => expandedName} ${() => disabledName} ${() => selectedName}

            <nimble-tree-item
                ?disabled="${() => disabled}"
                ?selected="${() => selected}"
            >
                <span slot="start">${notebook16X16.data}</span>
                Nested Item 1
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
                <span slot="start">${notebook16X16.data}</span>
                Nested Item 2
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
                <span slot="start">${notebook16X16.data}</span>
                Nested Item 3
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
            selectedStates
        ])
    )
);

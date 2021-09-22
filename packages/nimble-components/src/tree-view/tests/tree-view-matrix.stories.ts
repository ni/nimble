import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../tree-item/index';
import {
    jobs16X16,
    notebook16X16
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import {
    matrixThemeWrapper,
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
        }
    }
};

const component = (
    [disabledName, disabled]: DisabledState,
    [expandedName, expanded]: ExpandedState,
    [selectedName, selected]: SelectedState
): string => `
    <nimble-tree-view>
        <nimble-tree-item ${expanded} ${disabled} ${selected}><span slot="start">${jobs16X16.data}</span>${expandedName} ${disabledName} ${selectedName} 
            <nimble-tree-item ${disabled}>Nested Item 1</nimble-tree-item>
            <nimble-tree-item ${disabled}><span slot="start">${notebook16X16.data}</span>Nested Item 2</nimble-tree-item>
            <nimble-tree-item ${disabled}><span slot="start">${notebook16X16.data}</span>Nested Item 3</nimble-tree-item>
        </nimble-tree-item>
    </nimble-tree-view>
`;

export default metadata;

export const treeViewThemeMatrix: Story = (): string => matrixThemeWrapper(component, [
    disabledStates,
    expandedStates,
    selectedStates
]);

import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
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

type IconState = [string, boolean];
const iconStates: IconState[] = [
    ['No Icon', false],
    ['With Icon', true]
];

const component = (
    [disabledName, disabled]: DisabledState,
    [expandedName, expanded]: ExpandedState,
    [selectedName, selected]: SelectedState,
    [iconName, icon]: IconState
): ViewTemplate => html`
    <nimble-tree-view style="padding: 10px">
        <nimble-tree-item
            ?expanded="${() => expanded}"
            ?disabled="${() => disabled}"
        >
            ${when(() => icon, html`<span slot="start">${jobs16X16.data}</span>`)}
            ${() => expandedName} ${() => disabledName} ${() => selectedName} ${() => iconName}
            <nimble-tree-item
                ?disabled="${() => disabled}"
                ?selected="${() => selected}"
            >
            ${when(() => icon, html`<span slot="start">${notebook16X16.data}</span>`)}
                Nested Item 1
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
            ${when(() => icon, html`<span slot="start">${notebook16X16.data}</span>`)}
                Nested Item 2
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
            ${when(() => icon, html`<span slot="start">${notebook16X16.data}</span>`)}
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
            selectedStates,
            iconStates
        ])
    )
);

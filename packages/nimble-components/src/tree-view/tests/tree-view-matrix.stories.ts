import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import '../index';
import '../../tree-item/index';
import '../../icons/measurement-data-analysis';
import '../../icons/settings';
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
    iconVisibleStates,
    hiddenStates,
    HiddenState
} from '../../utilities/tests/matrix';

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

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [expandedName, expanded]: ExpandedState,
    [selectedName, selected]: SelectedState,
    iconVisible: IconVisibleState,
    hidden: HiddenState
): ViewTemplate => html`
    <nimble-tree-view style="padding: 10px" ?hidden="${() => hidden}">
        <nimble-tree-item
            ?expanded="${() => expanded}"
            ?disabled="${() => disabled}"
        >
            ${when(() => iconVisible, html`<nimble-measurement-data-analysis-icon></nimble-measurement-data-analysis-icon>`)}
            ${() => expandedName} ${() => disabledName} ${() => selectedName}
            <nimble-tree-item
                ?disabled="${() => disabled}"
                ?selected="${() => selected}"
            >
            ${when(() => iconVisible, html`<nimble-settings-icon></nimble-settings-icon>`)}
                Nested Item 1
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
            ${when(() => iconVisible, html`<nimble-settings-icon></nimble-settings-icon>`)}
                Nested Item 2
            </nimble-tree-item>
            <nimble-tree-item ?disabled="${() => disabled}">
            ${when(() => iconVisible, html`<nimble-settings-icon></nimble-settings-icon>`)}
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
            iconVisibleStates,
            hiddenStates
        ])
    )
);

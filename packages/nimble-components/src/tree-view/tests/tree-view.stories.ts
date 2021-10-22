import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../tree-item/index';
import '../../icons/measurement-data-analysis';
import '../../icons/settings';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import { SelectionMode } from '../types';

interface TreeArgs {
    selectionMode: SelectionMode;
    options: ItemArgs[];
}

interface ItemArgs {
    label: string;
    value: string;
    disabled: boolean;
    icon: boolean;
    expanded: boolean;
}

const metadata: Meta<TreeArgs> = {
    title: 'Tree View',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl: ''
        },
        actions: {
            handles: ['expanded-change', 'selected-change']
        }
    },
    argTypes: {
        selectionMode: {
            options: Object.values(SelectionMode),
            control: { type: 'radio' }
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-tree-view selection-mode="${x => x.selectionMode}">
            ${repeat(x => x.options, html<ItemArgs>`
                <nimble-tree-item ?expanded="${x => x.expanded}" value="${x => x.value}">
                    ${when(x => x.icon, html`<nimble-measurement-data-analysis-icon></nimble-measurement-data-analysis-icon>`)}
                    ${x => x.label}
                    <nimble-tree-item ?expanded="${x => x.expanded}" ?disabled="${x => x.disabled}">
                         ${when(x => x.icon, html`<nimble-settings-icon></nimble-settings-icon>`)}
                         Sub Group
                        <nimble-tree-item ?disabled="${x => x.disabled}">
                            ${when(x => x.icon, html`<nimble-settings-icon></nimble-settings-icon>`)}
                            <a href="http://www.ni.com">Nested Item 1</a>
                        </nimble-tree-item>
                    </nimble-tree-item>
                    <nimble-tree-item ?selected="${x => x.expanded}">
                        ${when(x => x.icon, html`<nimble-settings-icon></nimble-settings-icon>`)}
                        Nested Item 2
                    </nimble-tree-item>
                    <nimble-tree-item>
                        ${when(x => x.icon, html`<nimble-settings-icon></nimble-settings-icon>`)}
                        Nested Item 3
                     </nimble-tree-item>
                </nimble-tree-item>
            `)}
        </nimble-tree-view>
`),
    args: {
        selectionMode: SelectionMode.LeavesOnly,
        options: [
            {
                label: 'Option 1',
                value: '1',
                disabled: false,
                icon: true,
                expanded: false
            },
            {
                label: 'Option 2',
                value: '2',
                disabled: true,
                icon: true,
                expanded: true
            },
            {
                label: 'Option 3',
                value: '3',
                disabled: false,
                icon: true,
                expanded: false
            },
            {
                label: 'Option 4',
                value: '3',
                disabled: false,
                icon: false,
                expanded: false
            }
        ]
    }
};

export default metadata;

export const treeView: Story<TreeArgs> = {};

import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '..';
import '../../tree-item';
import '../../icons/measurement-data-analysis';
import '../../icons/settings';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { TreeViewSelectionMode } from '../types';

interface TreeArgs {
    selectionMode: TreeViewSelectionMode;
    options: ItemArgs[];
}

interface ItemArgs {
    label: string;
    value: string;
    disabled: boolean;
    icon: boolean;
    expanded: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#TreeView) - A tree view widget
presents a hierarchical list. Any item in the hierarchy may have child items, and items that have
children may be expanded or collapsed to show or hide the children. For example, in a file system
navigator that uses a tree view to display folders and files, an item representing a folder can be
expanded to reveal the contents of the folder, which may be files, folders, or both.`;

const metadata: Meta<TreeArgs> = {
    title: 'Tree View',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl: ''
        },
        actions: {
            handles: ['expanded-change', 'selected-change']
        }
    },
    argTypes: {
        selectionMode: {
            options: Object.values(TreeViewSelectionMode),
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
                         ${when(x => x.icon, html`<nimble-settings-icon slot="start"></nimble-settings-icon>`)}
                         Sub Group
                        <nimble-tree-item ?disabled="${x => x.disabled}">
                            ${when(x => x.icon, html`<nimble-settings-icon slot="start"></nimble-settings-icon>`)}
                            <a href="http://www.ni.com">Nested Item 1</a>
                        </nimble-tree-item>
                    </nimble-tree-item>
                    <nimble-tree-item ?selected="${x => x.expanded}">
                        ${when(x => x.icon, html`<nimble-settings-icon slot="start"></nimble-settings-icon>`)}
                        Nested Item 2
                    </nimble-tree-item>
                    <nimble-tree-item>
                        ${when(x => x.icon, html`<nimble-settings-icon slot="start"></nimble-settings-icon>`)}
                        Nested Item 3
                     </nimble-tree-item>
                </nimble-tree-item>
            `)}
        </nimble-tree-view>
`),
    args: {
        selectionMode: TreeViewSelectionMode.LeavesOnly,
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

export const treeView: StoryObj<TreeArgs> = {};

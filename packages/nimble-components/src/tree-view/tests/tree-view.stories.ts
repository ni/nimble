import type { Meta, StoryObj } from '@storybook/html';
import '..';
import '../../tree-item';
import '../../icons/database';
import '../../icons/cog';
import { html, repeat, when } from '@microsoft/fast-element';
import { createThemeAwareStory } from '../../utilities/tests/storybook';
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

const selectionModeDescription = `
<li>All: all items in the tree are selectable through user interaction</li>
<li>Leaves only: only the leaf items in the tree are selectable through user interaction</li>
<li>None: no items in the tree are selectable through user interaction</li>
<br>
Note: Changing the selection mode does not affect which items can be selected programmatically.
`;

const metadata: Meta<TreeArgs> = {
    title: 'Tree View',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {
            handles: ['expanded-change', 'selected-change']
        }
    },
    argTypes: {
        selectionMode: {
            description: selectionModeDescription
        }
    }
};

export default metadata;

export const treeItem: StoryObj<ItemArgs> = {
    argTypes: {
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        }
    },
    // prettier-ignore
    render: createThemeAwareStory(html`
        <nimble-tree-view>
            <nimble-tree-item ?expanded="${x => x.expanded}" ?disabled="${x => x.disabled}" value="${x => x.value}">
                ${when(x => x.icon, html`<nimble-database-icon slot="start"></nimble-database-icon>`)}
                ${x => x.label}
                <nimble-tree-item>
                   Sub Item
                </nimble-tree-item>
            </nimble-tree-item>
        </nimble-tree-view>
`),
    args: {
        label: 'Item',
        value: '1',
        disabled: false,
        icon: true,
        expanded: true
    }
};

export const multipleTreeItems: StoryObj<TreeArgs> = {
    argTypes: {
        selectionMode: {
            options: Object.values(TreeViewSelectionMode),
            control: { type: 'radio' }
        }
    },
    // prettier-ignore
    render: createThemeAwareStory(html`
        <nimble-tree-view selection-mode="${x => x.selectionMode}">
            ${repeat(x => x.options, html<ItemArgs>`
                <nimble-tree-item ?expanded="${x => x.expanded}" value="${x => x.value}">
                    ${when(x => x.icon, html`<nimble-database-icon slot="start"></nimble-database-icon>`)}
                    ${x => x.label}
                    <nimble-tree-item ?expanded="${x => x.expanded}" ?disabled="${x => x.disabled}">
                         ${when(x => x.icon, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
                         Sub Group
                        <nimble-tree-item ?disabled="${x => x.disabled}">
                            ${when(x => x.icon, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
                            <a href="http://www.ni.com">Nested Item 1</a>
                        </nimble-tree-item>
                    </nimble-tree-item>
                    <nimble-tree-item ?selected="${x => x.expanded}">
                        ${when(x => x.icon, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
                        Nested Item 2
                    </nimble-tree-item>
                    <nimble-tree-item>
                        ${when(x => x.icon, html`<nimble-cog-icon slot="start"></nimble-cog-icon>`)}
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

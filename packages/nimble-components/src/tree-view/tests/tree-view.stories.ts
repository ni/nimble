import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { TreeViewSelectionMode } from '../types';
import { treeViewTag } from '..';
import { iconCogTag } from '../../icons/cog';
import { iconDatabaseTag } from '../../icons/database';
import { treeItemTag } from '../../tree-item';
import { anchorTreeItemTag } from '../../anchor-tree-item';

interface TreeArgs {
    selectionMode: TreeViewSelectionMode;
    options: ItemArgs[];
}

interface ItemArgs {
    label: string;
    value: string;
    disabled: boolean;
    icon: boolean;
    selected: boolean;
    expanded: boolean;
}

interface AnchorItemArgs {
    label: string;
    href: string;
    disabled: boolean;
    selected: boolean;
    icon: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#TreeView) - A tree view widget
presents a hierarchical list. Any item in the hierarchy may have child items, and items that have
children may be expanded or collapsed to show or hide the children. For example, in a file system
navigator that uses a tree view to display folders and files, an item representing a folder can be
expanded to reveal the contents of the folder, which may be files, folders, or both.

The \`nimble-tree-view\` supports standard \`nimble-tree-item\`s and \`nimble-anchor-tree-item\`s,
which navigate to a url upon activation. Both types of tree items support icons as slotted content.`;

const selectionModeDescription = `
<li>All: all items in the tree are selectable through user interaction</li>
<li>Leaves only: only the leaf items in the tree are selectable through user interaction</li>
<li>None: no items in the tree are selectable through user interaction</li>
<br>
Note: Changing the selection mode does not affect which items can be selected programmatically.
`;

const hrefDescription = `
In addition to \`href\`, all other attributes of \`<a>\` are also supported, e.g. \`ping\`, \`target\`, \`type\`, etc.
`;

const metadata: Meta<TreeArgs> = {
    title: 'Tree View',
    tags: ['autodocs'],
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
    parameters: {
        docs: {
            description: {
                story: 'Use a `nimble-tree-item` if you want a tree item that calls a callback, has a value, and/or has child items. Use a `nimble-anchor-tree-item` instead if you want to navigate to a URL.'
            }
        }
    },
    argTypes: {
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${treeViewTag}>
            <${treeItemTag} ?expanded="${x => x.expanded}" ?selected="${x => x.selected}" ?disabled="${x => x.disabled}" value="${x => x.value}">
                ${when(x => x.icon, html`<${iconDatabaseTag} slot="start"></${iconDatabaseTag}>`)}
                ${x => x.label}
                <${treeItemTag}>
                   Sub Item
                </${treeItemTag}>
            </${treeItemTag}>
        </${treeViewTag}>
`),
    args: {
        label: 'Item',
        value: '1',
        disabled: false,
        icon: true,
        selected: false,
        expanded: true
    }
};

export const anchorTreeItem: StoryObj<AnchorItemArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'Use a `nimble-anchor-tree-item` to navigate to a URL from a `nimble-tree-view`. If you want a tree item that can have a value and/or child items, use a `nimble-tree-item` instead.'
            }
        }
    },
    argTypes: {
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
        selected: {
            description:
                'Cannot be selected interactively, as click/Enter causes navigation.'
        },
        href: {
            description: hrefDescription
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${treeViewTag}>
            <${anchorTreeItemTag} ?selected="${x => x.selected}" ?disabled="${x => x.disabled}" href="${x => x.href}">
                ${when(x => x.icon, html`<${iconDatabaseTag} slot="start"></${iconDatabaseTag}>`)}
                ${x => x.label}
            </${anchorTreeItemTag}>
        </${treeViewTag}>
`),
    args: {
        label: 'Item',
        href: 'https://nimble.ni.dev',
        disabled: false,
        icon: true,
        selected: false
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
    render: createUserSelectedThemeStory(html`
        <${treeViewTag} selection-mode="${x => x.selectionMode}">
            ${repeat(x => x.options, html<ItemArgs>`
                <${treeItemTag} ?expanded="${x => x.expanded}" value="${x => x.value}">
                    ${when(x => x.icon, html`<${iconDatabaseTag} slot="start"></${iconDatabaseTag}>`)}
                    ${x => x.label}
                    <${treeItemTag} ?expanded="${x => x.expanded}" ?disabled="${x => x.disabled}">
                         ${when(x => x.icon, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                         Sub Group
                        <${anchorTreeItemTag} ?disabled="${x => x.disabled}" href="https://nimble.ni.dev">
                            ${when(x => x.icon, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                            Nested Item 1 (link)
                        </${anchorTreeItemTag}>
                    </${treeItemTag}>
                    <${treeItemTag} ?selected="${x => x.expanded}">
                        ${when(x => x.icon, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                        Nested Item 2
                    </${treeItemTag}>
                    <${treeItemTag}>
                        ${when(x => x.icon, html`<${iconCogTag} slot="start"></${iconCogTag}>`)}
                        Nested Item 3
                     </${treeItemTag}>
                </${treeItemTag}>
            `)}
        </${treeViewTag}>
`),
    args: {
        selectionMode: TreeViewSelectionMode.leavesOnly,
        options: [
            {
                label: 'Option 1',
                value: '1',
                disabled: false,
                icon: true,
                selected: false,
                expanded: false
            },
            {
                label: 'Option 2',
                value: '2',
                disabled: true,
                icon: true,
                selected: false,
                expanded: true
            },
            {
                label: 'Option 3',
                value: '3',
                disabled: false,
                icon: true,
                selected: false,
                expanded: false
            },
            {
                label: 'Option 4',
                value: '3',
                disabled: false,
                icon: false,
                selected: false,
                expanded: false
            }
        ]
    }
};

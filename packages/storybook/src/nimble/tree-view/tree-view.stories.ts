import { html, repeat, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { iconCogTag } from '../../../../nimble-components/src/icons/cog';
import { iconDatabaseTag } from '../../../../nimble-components/src/icons/database';
import { treeItemTag } from '../../../../nimble-components/src/tree-item';
import { anchorTreeItemTag } from '../../../../nimble-components/src/anchor-tree-item';
import { treeViewTag } from '../../../../nimble-components/src/tree-view';
import { TreeViewSelectionMode } from '../../../../nimble-components/src/tree-view/types';
import { apiCategory, createUserSelectedThemeStory, disabledDescription } from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

interface TreeArgs {
    selectionMode: TreeViewSelectionMode;
    options: ItemArgs[];
    expandedChange: undefined;
    selectedChange: undefined;
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

const selectionModeDescription = `
<li>all: All items in the tree are selectable through user interaction</li>
<li>leaves-only: Only the leaf items in the tree are selectable through user interaction</li>
<li>none: No items in the tree are selectable through user interaction</li>
<br>
Note: Changing the selection mode does not affect which items can be selected programmatically.
`;
const iconDescription = 'To place an icon at the far-left of the item, set `slot="start"` on the icon.';
const labelDescription = 'The text content of the tree item.';

const metadata: Meta<TreeArgs> = {
    title: 'Components/Tree View',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['expanded-change', 'selected-change']
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
        label: {
            name: 'default',
            description: `${labelDescription} Tree items can also contain child tree items to establish hierarchy.`,
            table: { category: apiCategory.slots }
        },
        value: {
            description: 'A value for this tree item that can be used to identify the item when handling tree events.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'tree item' }),
            table: { category: apiCategory.attributes }
        },
        icon: {
            name: 'start',
            description: iconDescription,
            table: { category: apiCategory.slots }
        },
        selected: {
            description: 'Whether this item is selected.',
            table: { category: apiCategory.attributes }
        },
        expanded: {
            description: 'Whether this item is expanded.',
            table: { category: apiCategory.attributes }
        },
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
                story: `Use a \`${anchorTreeItemTag}\` to navigate to a URL from a \`${treeViewTag}\`. If you want a tree item that can have a value and/or child items, use a \`${treeItemTag}\` instead.`
            }
        }
    },
    argTypes: {
        label: {
            name: 'default',
            description: labelDescription,
            table: { category: apiCategory.slots }
        },
        href: {
            description: hrefDescription({ componentName: 'anchor tree item', includeDisable: false }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'tree item' }),
            table: { category: apiCategory.attributes }
        },
        selected: {
            description:
                'Set this attribute programmatically to render the item as selected. It cannot be selected interactively, as click/Enter causes navigation.',
            table: { category: apiCategory.attributes }
        },
        icon: {
            description: iconDescription,
            table: { category: apiCategory.slots }
        },
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
            name: 'selection-mode',
            options: Object.values(TreeViewSelectionMode),
            control: { type: 'radio' },
            description: selectionModeDescription,
            table: { category: apiCategory.attributes }

        },
        options: {
            name: 'default',
            description:
                `One or more \`${treeItemTag}\` or \`${anchorTreeItemTag}\` elements which populate the tree. Nest items to establish tree hierarchy.`,
            table: { category: apiCategory.slots }
        },
        expandedChange: {
            name: 'expanded-change',
            description: 'Event emitted when an item is expanded or collapsed.',
            table: { category: apiCategory.events }
        },
        selectedChange: {
            name: 'selected-change',
            description: 'Event emitted when an item is selected or deselected.',
            table: { category: apiCategory.events }
        },
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

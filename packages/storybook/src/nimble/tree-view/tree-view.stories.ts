import { html, repeat, when } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { iconDatabaseTag } from '@ni/nimble-components/dist/esm/icons/database';
import { treeItemTag } from '@ni/nimble-components/dist/esm/tree-item';
import { anchorTreeItemTag } from '@ni/nimble-components/dist/esm/anchor-tree-item';
import { treeViewTag } from '@ni/nimble-components/dist/esm/tree-view';
import { TreeViewSelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    iconDescription,
    textContentDescription
} from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

interface TreeArgs {
    selectionMode: TreeViewSelectionMode;
    options: ItemArgs[];
    expandedChange: undefined;
    selectedChange: undefined;
}

interface ItemArgs {
    label: string;
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

const metadata: Meta<TreeArgs> = {
    title: 'Components/Tree View',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: [
                'expanded-change', // nimble-tree-item event
                'selected-change' // nimble-tree-item event
            ]
        }
    }
};

export default metadata;

export const treeItem: StoryObj<ItemArgs> = {
    parameters: {
        docs: {
            description: {
                story: `Use a \`${treeItemTag}\` if you want a tree item that calls a callback and/or has child items. Use a \`${anchorTreeItemTag}\` instead if you want to navigate to a URL.`
            }
        }
    },
    argTypes: {
        label: {
            name: 'default',
            description: `${textContentDescription({ componentName: 'tree item' })} Tree items can also contain child tree items to establish hierarchy.`,
            table: { category: apiCategory.slots }
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
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${treeViewTag}>
            <${treeItemTag} ?expanded="${x => x.expanded}" ?selected="${x => x.selected}" ?disabled="${x => x.disabled}">
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
                story: `Use a \`${anchorTreeItemTag}\` to navigate to a URL from a \`${treeViewTag}\`. If you want a tree item that can have child items, use a \`${treeItemTag}\` instead.`
            }
        }
    },
    argTypes: {
        label: {
            name: 'default',
            description: textContentDescription({
                componentName: 'anchor tree item'
            }),
            table: { category: apiCategory.slots }
        },
        href: {
            description: hrefDescription({
                componentName: 'anchor tree item',
                includeDisable: false
            }),
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
            name: 'start',
            description: iconDescription,
            table: { category: apiCategory.slots }
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
            name: 'selection-mode',
            options: Object.values(TreeViewSelectionMode),
            control: { type: 'radio' },
            description: selectionModeDescription,
            table: { category: apiCategory.attributes }
        },
        options: {
            name: 'default',
            description: `One or more \`${treeItemTag}\` or \`${anchorTreeItemTag}\` elements which populate the tree. Nest items to establish tree hierarchy.`,
            table: { category: apiCategory.slots }
        },
        expandedChange: {
            name: 'expanded-change',
            description:
                'Bubbling event emitted by a tree item child when expanded or collapsed. Easier to listen for the event on parent tree view than on each tree item child.',
            table: { category: apiCategory.events }
        },
        selectedChange: {
            name: 'selected-change',
            description:
                'Bubbling event emitted by a tree item child when selected or deselected. Easier to listen for the event on parent tree view than on each tree item child.',
            table: { category: apiCategory.events }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${treeViewTag} selection-mode="${x => x.selectionMode}">
            ${repeat(x => x.options, html<ItemArgs>`
                <${treeItemTag} ?expanded="${x => x.expanded}">
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
                disabled: false,
                icon: true,
                selected: false,
                expanded: false
            },
            {
                label: 'Option 2',
                disabled: true,
                icon: true,
                selected: false,
                expanded: true
            },
            {
                label: 'Option 3',
                disabled: false,
                icon: true,
                selected: false,
                expanded: false
            },
            {
                label: 'Option 4',
                disabled: false,
                icon: false,
                selected: false,
                expanded: false
            }
        ]
    }
};

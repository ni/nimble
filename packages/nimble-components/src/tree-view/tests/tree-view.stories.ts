import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../tree-item/index';
import {
    jobs16X16,
    notebook16X16
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

interface TreeArgs {
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
    // prettier-ignore
    render: ({ options }: TreeArgs): string => `
        <nimble-tree-view>
        ${options.map(option => `
            <nimble-tree-item ${option.expanded ? 'expanded' : ''} value="${option.value}" ${option.disabled ? 'disabled' : ''}>
                ${option.icon ? `<svg slot="start">${jobs16X16.data}</svg>` : ''}
                ${option.label}
                <nimble-tree-item>Nested Item 1</nimble-tree-item>
                <nimble-tree-item><svg slot="start">${notebook16X16.data}</svg>Nested Item 2</nimble-tree-item>
                <nimble-tree-item><svg slot="start">${notebook16X16.data}</svg>Nested Item 3</nimble-tree-item>
            </nimble-tree-item>\n`)
        .join('')}
        </nimble-tree-view>
`,
    args: {
        options: [
            {
                label: 'Option 1',
                value: '1',
                disabled: false,
                icon: true,
                expanded: true
            },
            {
                label: 'Option 2',
                value: '2',
                disabled: true,
                icon: true,
                expanded: false
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

import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../tree-item/index';
import {
    slHeader32X32,
    chart40X40
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

interface TreeArgs {
    options: ItemArgs[];
}

interface ItemArgs {
    label: string;
    value: string;
    disabled: boolean;
    icon: boolean;
}

const metadata: Meta<TreeArgs> = {
    title: 'Tree View',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl: ''
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: ({ options }: TreeArgs): string => `
        <nimble-tree-view>
        ${options.map(option => `
            <nimble-tree-item value="${option.value}" ${option.disabled ? 'disabled' : ''}>
                ${option.icon ? `<svg slot="start">${slHeader32X32.data}</svg>` : ''}
                ${option.label}
                <nimble-tree-item slot="item">Nested Item 1</nimble-tree-item>
                <nimble-tree-item slot="item"><svg slot="start">${chart40X40.data}</svg>Nested Item 2</nimble-tree-item>
                <nimble-tree-item slot="item"><svg slot="start">${chart40X40.data}</svg>Nested Item 3</nimble-tree-item>
            </nimble-tree-item>\n`)
        .join('')}
        </nimble-tree-view>
`,
    args: {
        options: [
            { label: 'Option 1', value: '1', disabled: false, icon: true },
            { label: 'Option 2', value: '2', disabled: true, icon: true },
            { label: 'Option 3', value: '3', disabled: false, icon: true },
            { label: 'Option 4', value: '3', disabled: false, icon: false }
        ]
    }
};

export default metadata;

export const treeView: Story<TreeArgs> = {};

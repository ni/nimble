import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../tree-item/index';

interface TreeArgs {
    disabled: boolean;
    options: ItemArgs[];
}

interface ItemArgs {
    label: string;
    value: string;
    disabled: boolean;
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
    render: ({ disabled, options }: TreeArgs): string => `
        <nimble-tree-view
            ${disabled ? 'disabled' : ''}
        >
            ${options
        .map(
            option => `<nimble-tree-item value="${option.value}" ${
                option.disabled ? 'disabled' : ''
            }>${option.label}</nimble-tree-item>\n`
        )
        .join('')}
        </nimble-tree-view>
`,
    args: {
        disabled: false,
        options: [
            { label: 'Option 1', value: '1', disabled: false },
            { label: 'Option 2', value: '2', disabled: true },
            {
                label: 'Option 3<nimble-tree-item slot="item">Nested Option 3</nimble-tree-item>',
                value: '3',
                disabled: false
            }
        ]
    }
};

export default metadata;

export const treeView: Story<TreeArgs> = {};

export const test = {
    render: (): string => `
        <nimble-tree-view>
            <nimble-tree-item>Root node one</nimble-tree-item>
            <nimble-tree-item>Root node two</nimble-tree-item>
            <nimble-tree-item>Root node two and a half
                <nimble-tree-item slot="item">Nested node one
                    <nimble-tree-item>Two deep</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item slot="item">Nested node two</nimble-tree-item>
            </nimble-tree-item>
            <nimble-tree-item>Root node three</nimble-tree-item>
        </nimble-tree-view>`
};

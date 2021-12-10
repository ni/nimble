import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../listbox-option/index';
import { html, repeat } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';

interface SelectArgs {
    disabled: boolean;
    dropDownPosition: string;
    options: OptionArgs[];
}

interface OptionArgs {
    label: string;
    value: string;
    disabled: boolean;
}

const metadata: Meta<SelectArgs> = {
    title: 'Select',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Select is a list in which the current value is displayed in the element. Upon clicking on the element, the other options are visible. The user cannot manually enter values.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-select ?disabled="${x => x.disabled}" position="${x => x.dropDownPosition}">
            ${repeat(x => x.options, html<OptionArgs>`
                <nimble-listbox-option value="${x => x.value}" ?disabled="${x => x.disabled}">
                    ${x => x.label}
                </nimble-listbox-option>
            `)}
        </nimble-select>
    `),
    argTypes: {
        dropDownPosition: {
            options: ['above', 'below'],
            control: { type: 'select' }
        }
    },
    args: {
        disabled: false,
        dropDownPosition: 'below',
        options: [
            { label: 'Option 1', value: '1', disabled: false },
            { label: 'Option 2', value: '2', disabled: true },
            { label: 'Option 3', value: '3', disabled: false }
        ]
    }
};

export default metadata;

export const select: StoryObj<SelectArgs> = {};

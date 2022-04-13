import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '..';
import '../../list-option';
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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-select ?disabled="${x => x.disabled}" position="${x => x.dropDownPosition}">
            ${repeat(x => x.options, html<OptionArgs>`
                <nimble-list-option value="${x => x.value}" ?disabled="${x => x.disabled}">
                    ${x => x.label}
                </nimble-list-option>
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
            { label: 'Option 3', value: '3', disabled: false },
            { label: 'Option 4', value: '4', disabled: false },
            { label: 'Option 5', value: '5', disabled: false },
            { label: 'Option 6', value: '6', disabled: false },
            { label: 'Option 7', value: '7', disabled: false },
            { label: 'Option 8', value: '8', disabled: false },
            { label: 'Option 9', value: '9', disabled: false },
            { label: 'Option 10', value: '10', disabled: false },
            { label: 'Option 11', value: '11', disabled: false },
            { label: 'Option 12', value: '12', disabled: false },
            { label: 'Option 13', value: '13', disabled: false },
            { label: 'Option 14', value: '14', disabled: false },
            { label: 'Option 15', value: '15', disabled: false },
            { label: 'Option 16', value: '16', disabled: false },
            { label: 'Option 17', value: '17', disabled: false },
            { label: 'Option 18', value: '18', disabled: false },
            { label: 'Option 19', value: '19', disabled: false },
            { label: 'Option 20', value: '20', disabled: false }
        ]
    }
};

export default metadata;

export const select: StoryObj<SelectArgs> = {};

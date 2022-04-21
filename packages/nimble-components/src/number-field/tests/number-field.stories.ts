import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createThemeAwareStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface NumberFieldArgs {
    label: string;
    value: number;
    disabled: boolean;
}

const metadata: Meta<NumberFieldArgs> = {
    title: 'Number Field',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Similar to a single line text box but only used for numeric data. The controls allow the user to increment and decrement the value.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    render: createThemeAwareStory(html`
        <nimble-number-field
            placeholder="${x => x.label}"
            value="${x => x.value}"
            ?disabled="${x => x.disabled}"
        >
            ${x => x.label}
        </nimble-number-field>
    `),
    args: {
        label: 'default label',
        value: 42,
        disabled: false
    }
};

export default metadata;

export const numberField: StoryObj<NumberFieldArgs> = {
    args: { label: 'Number Field' }
};

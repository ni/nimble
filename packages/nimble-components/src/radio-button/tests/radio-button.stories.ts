import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface RadioButtonArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
}

const metadata: Meta<RadioButtonArgs> = {
    title: 'Radio Button',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#radiobutton) – A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time. Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-radio-button
            checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
        >
            ${x => x.label}
        </nimble-radio-button>
    `),
    args: {
        label: 'Radio button label',
        checked: false,
        disabled: false
    }
};

export default metadata;

export const radioButton: StoryObj<RadioButtonArgs> = {};

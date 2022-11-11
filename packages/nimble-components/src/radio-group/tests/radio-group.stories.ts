import { html } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface RadioGroupArgs {
    label: string;
    orientation: Orientation;
    disabled: boolean;
    name: string;
    value: string;
}

const metadata: Meta<RadioGroupArgs> = {
    title: 'Radio Group',
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
        <nimble-radio-group
            orientation="${x => x.orientation}"
            ?disabled="${x => x.disabled}"
            name="${x => x.name}"
            value="${x => x.value}"
        >
            <label slot="label">${x => x.label}</label>
            <nimble-radio value="apple">Apple</nimble-radio>
            <nimble-radio value="mango">Mango</nimble-radio>
            <nimble-radio value="orange">Orange</nimble-radio>
        </nimble-radio-group>
    `),
    args: {
        label: 'Fruit',
        orientation: Orientation.horizontal,
        disabled: false,
        name: 'fruit',
        value: 'none'
    },
    argTypes: {
        value: {
            options: ['none', 'apple', 'mango', 'orange'],
            control: {
                type: 'radio'
            }
        },
        label: {
            description:
                'You must provide a `label` element with `slot="label"` as content of the `nimble-radio-group`.'
        },
        orientation: {
            options: Object.values(Orientation),
            control: {
                type: 'radio',
                labels: {
                    [Orientation.horizontal]: 'Horizontal',
                    [Orientation.vertical]: 'Vertical'
                }
            },
            table: {
                defaultValue: { summary: 'Horizontal' }
            }
        },
        name: {
            description:
                'Radio buttons whose values are mutually exclusive should set the same `name` attribute. Setting the name on the group sets it on all child radio buttons.'
        }
    }
};

export default metadata;

export const radioGroup: StoryObj<RadioGroupArgs> = {};

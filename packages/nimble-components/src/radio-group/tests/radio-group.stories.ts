import { html } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { radioGroupTag } from '..';
import { radioTag } from '../../radio';

interface RadioGroupArgs {
    label: string;
    orientation: Orientation;
    disabled: boolean;
    name: string;
    value: string;
}

const metadata: Meta<RadioGroupArgs> = {
    title: 'Radio Group',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#radiobutton) – A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time. Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow.'
            }
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html`
        <${radioGroupTag}
            orientation="${x => x.orientation}"
            ?disabled="${x => x.disabled}"
            name="${x => x.name}"
            value="${x => x.value}"
        >
            <label slot="label">${x => x.label}</label>
            <${radioTag} value="apple">Apple</${radioTag}>
            <${radioTag} value="mango">Mango</${radioTag}>
            <${radioTag} value="orange">Orange</${radioTag}>
        </${radioGroupTag}>
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

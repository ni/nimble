import { html } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { radioTag } from '@ni/nimble-components/dist/esm/radio';
import { radioGroupTag } from '@ni/nimble-components/dist/esm/radio-group';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

interface RadioGroupArgs {
    label: string;
    orientation: Orientation;
    disabled: boolean;
    name: string;
    value: string;
}

const metadata: Meta<RadioGroupArgs> = {
    title: 'Components/Radio Group',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
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
                'Radio buttons whose values are mutually exclusive should set the same `name` attribute. Setting the name on the group sets it on all child radio buttons. When using radio buttons in an Angular form, you must explicitly set either `name` or `formControlName` on each radio button. In that scenario, setting `name` on the group is ineffective.'
        }
    }
};

export default metadata;

export const radioGroup: StoryObj<RadioGroupArgs> = {};

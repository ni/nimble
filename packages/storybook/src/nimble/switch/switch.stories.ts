import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { switchTag } from '@ni/nimble-components/dist/esm/switch';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface SwitchArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
    checkedMessage: string;
    uncheckedMessage: string;
    change: undefined;
}

const metadata: Meta<SwitchArgs> = {
    title: 'Components/Switch',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${switchTag}
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
        >
            ${when(x => x.label, html<SwitchArgs>`${x => x.label}`)}
            ${when(x => x.checkedMessage, html<SwitchArgs>`<span slot="checked-message">${x => x.checkedMessage}</span>`)}
            ${when(x => x.uncheckedMessage, html<SwitchArgs>`<span slot="unchecked-message">${x => x.uncheckedMessage}</span>`)}
        </${switchTag}>
    `),
    argTypes: {
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'switch' })}`,
            table: { category: apiCategory.slots }
        },
        checked: {
            description: 'Whether the switch is toggled on.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'switch' }),
            table: { category: apiCategory.attributes }
        },
        checkedMessage: {
            name: 'checked-message',
            description:
                'A `span` element containing the message to display when the switch is toggled on.',
            table: { category: apiCategory.slots }
        },
        uncheckedMessage: {
            name: 'unchecked-message',
            description:
                'A `span` element containing the message to display when the switch is toggled off.',
            table: { category: apiCategory.slots }
        },
        change: {
            description: 'Event emitted when the user toggles the switch.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'Switch',
        checked: true,
        disabled: false,
        checkedMessage: 'On',
        uncheckedMessage: 'Off'
    }
};

export default metadata;

export const switchStory: StoryObj<SwitchArgs> = {
    name: 'Switch'
};

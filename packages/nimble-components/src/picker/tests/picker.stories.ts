import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../../anchored-region';
import '../model/picker-list';
import '../model/picker-list-item';
import '../model/picker-menu';
import '../model/picker-menu-option';
import '..';
import { html } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';

interface PickerArgs {
    readonly: boolean;
    placeholder: string;
    options: string;
    selection: string;
    menuPlacement: string;
}

const metadata: Meta<PickerArgs> = {
    title: 'Picker',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    "Picker is a multi-select dropdown filtered by the user's input. Selected items are displayed as chips/pills that can be deselected by clicking. The user cannot enter new values."
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        actions: {
            handles: [
                'selectionchange',
                'querychange',
                'menuopening',
                'menuclosing',
                'menuloaded'
            ]
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-picker
            ?readonly="${x => x.readonly}"
            style='width: 400px'
            selection=${x => x.selection}
            options=${x => x.options}
            no-suggestions-text="No suggestions available"
            suggestions-available-text=''
            loading-text="Loading"
            label=${x => x.placeholder}
            placeholder=${x => x.placeholder}
            menu-placement="${x => x.menuPlacement}">
        </nimble-picker>
    `),
    args: {
        readonly: false,
        placeholder: 'Pick some fruit',
        options:
            'apples,oranges,bananas,pears,pineapples,strawberries,mangoes,cherries,watermelons',
        selection: 'bananas,oranges',
        menuPlacement: 'bottom-fill'
    },
    argTypes: {
        menuPlacement: {
            options: [
                'bottom-fill',
                'bottom',
                'top-fill',
                'top',
                'tallest-fill',
                'tallest'
            ],
            control: { type: 'select' },
            description:
                'The placement of the popup menu, relative to the input control.',
            table: {
                defaultValue: { summary: 'bottom-fill' }
            }
        }
    }
};

export default metadata;

export const picker: StoryObj<PickerArgs> = {};

import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface DialogArgs {
    'prevent-dismiss': boolean;
}

const metadata: Meta<DialogArgs> = {
    title: 'Dialog',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'A modal dialog that appears centered on top of all other windows, blocking other interaction until dismissed.\n\nBy default, the first focusable control gets focus when the dialog is opened. To focus a specific element instead, set the `autofocus` attribute on that element.'
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-dialog
            ${ref('dialog')}
            aria-label="Here is a dialog"
            ?prevent-dismiss="${x => x['prevent-dismiss']}"
        >
            <h1>Here is a dialog</h1>
            <p>It can have some detailed message here.</p>
            <nimble-button @click="${x => x.dialog.close('Cancel pressed')}"
                >Cancel</nimble-button
            >
            <nimble-button @click="${x => x.dialog.close('OK pressed')}"
                >OK</nimble-button
            >
        </nimble-dialog>
        <nimble-button
            id="open"
            @click="${x => x.dialog.show().then(reason => {
        x.textField.value = reason.toString();
    })}"
            >Open</nimble-button
        >
        <div>
            <nimble-text-field ${ref('textField')} readonly
                >Close reason</nimble-text-field
            >
        </div>
    `),
    argTypes: {},
    args: {
        'prevent-dismiss': false
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {
    play: (): void => {
        document.getElementById('open')!.dispatchEvent(new Event('click'));
    }
};

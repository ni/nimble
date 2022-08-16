import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { Dialog, USER_DISMISSED } from '..';
import type { TextField } from '../../text-field';

interface DialogArgs {
    preventDismiss: boolean;
    dialogRef: Dialog<string>;
    textFieldRef: TextField;
    openAndHandleResult: (
        dialogRef: Dialog<string>,
        textFieldRef: TextField
    ) => void;
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
        <style class="code-hide">
            h1 {
                font: var(--ni-nimble-title-font);
                color: var(--ni-nimble-title-font-color);
            }
            p {
                font: var(--ni-nimble-body-font);
                color: var(--ni-nimble-body-font-color);
            }
        </style>
        <nimble-dialog
            ${ref('dialogRef')}
            aria-label="Here is a dialog"
            ?prevent-dismiss="${x => x.preventDismiss}"
        >
            <h1>Here is a dialog</h1>
            <p>It can have some detailed message here.</p>
            <nimble-button @click="${x => x.dialogRef.close('Cancel pressed')}">
                Cancel
            </nimble-button>
            <nimble-button @click="${x => x.dialogRef.close('OK pressed')}">
                OK
            </nimble-button>
        </nimble-dialog>
        <nimble-button
            id="open"
            @click="${x => x.openAndHandleResult(x.dialogRef, x.textFieldRef)}"
        >
            Open
        </nimble-button>
        <div>
            <nimble-text-field ${ref('textFieldRef')} readonly>
                Close reason
            </nimble-text-field>
        </div>
    `),
    argTypes: {
        preventDismiss: {
            name: 'prevent-dismiss'
        },
        openAndHandleResult: {
            table: {
                disable: true
            }
        }
    },
    args: {
        preventDismiss: false,
        openAndHandleResult: async (dialogRef, textFieldRef) => {
            const reason = await dialogRef.show();
            textFieldRef.value = reason === USER_DISMISSED ? 'ESC pressed' : reason;
        }
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

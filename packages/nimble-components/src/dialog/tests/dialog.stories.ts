import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { Dialog, USER_DISMISSED } from '..';
import type { TextField } from '../../text-field';

interface DialogArgs {
    title: string;
    subtitle: string;
    headerHidden: boolean;
    footerHidden: boolean;
    includeFooterButtons: boolean;
    preventDismiss: boolean;
    show: undefined;
    close: undefined;
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
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6f1b5b4d-2e50-4f8d-ad49-e3dac564a006/specs/'
        }
    },
    render: createUserSelectedThemeStory(html`
        <style class="code-hide">
            .first-button {
                margin-right: auto;
            }
        </style>
        <nimble-dialog
            ${ref('dialogRef')}
            ?prevent-dismiss="${x => x.preventDismiss}"
            ?header-hidden="${x => x.headerHidden}"
            ?footer-hidden="${x => x.footerHidden}"
        >
            <div slot="title">${x => x.title}</div>
            <div slot="subtitle">${x => x.subtitle}</div>
            <span>
                This action is destructive. Are you sure you would like to do
                it?
            </span>
            <nimble-checkbox>
                Perform some other relevant action too
            </nimble-checkbox>
            ${when(
        x => x.includeFooterButtons,
        html<DialogArgs>`
                    <nimble-button
                        @click="${x => x.dialogRef.close('Back pressed')}"
                        appearance="ghost"
                        slot="footer"
                        class="first-button"
                    >
                        Back
                    </nimble-button>
                    <nimble-button
                        @click="${x => x.dialogRef.close('Cancel pressed')}"
                        appearance="ghost"
                        slot="footer"
                    >
                        Cancel
                    </nimble-button>
                    <nimble-button
                        @click="${x => x.dialogRef.close('Continue pressed')}"
                        appearance="outline"
                        slot="footer"
                    >
                        Continue
                    </nimble-button>
                `
    )}
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
        title: {
            description:
                'Primary text that is displayed in the header when `header-hidden` is not set. Dialogs should **always include a title** even when `header-hidden` is set. The title is used to provide an accessible name to assistive technologies regardless of the value of `header-hidden`.'
        },
        subtitle: {
            description:
                'Secondary text that is displayed in the header when `header-hidden` is not set. If a dialog has an appropriate value to set for the subtitle, it should be included even when `header-hidden` is set. If the subtitle is set, it is used with the title to provide an accessible name to assistive technologies regardless of the value of `header-hidden`.'
        },
        headerHidden: {
            name: 'header-hidden',
            description:
                'Setting `header-hidden` hides the title and subtitle of the dialog and allows the main content of the dialog to fill the space that would otherwise be reserved for the header. A title (and optionally a subtitle) should still be provided when `header-hidden` is set to ensure the dialog has a label that can be used by assistive technologies.'
        },
        footerHidden: {
            name: 'footer-hidden',
            description:
                'Setting `footer-hidden` hides the footer of the dialog and any content that has been slotted within it. Setting `footer-hidden` also allows the main content of the dialog to fill the space that would otherwise be reserved for the footer.'
        },
        includeFooterButtons: {
            name: 'Include footer buttons'
        },
        show: {
            name: 'show()',
            description:
                'Call this member function to open the dialog. It returns a `Promise` that is resolved when the dialog is closed. The resolved value is either the reason passed to `close(...)` or the symbol USER_DISMISSED if the dialog was dismissed via the ESC key.'
        },
        close: {
            name: 'close(reason)',
            description:
                'Call this member function to close the dialog. It takes an optional `reason` value which can be any type. This value is returned from `show()` via a `Promise`'
        },
        openAndHandleResult: {
            table: {
                disable: true
            }
        }
    },
    args: {
        title: 'Dialog title',
        subtitle: 'Dialog subtitle',
        headerHidden: false,
        footerHidden: false,
        includeFooterButtons: true,
        preventDismiss: false,
        openAndHandleResult: async (dialogRef, textFieldRef) => {
            const reason = await dialogRef.show();
            textFieldRef.value = reason === USER_DISMISSED ? 'ESC pressed' : reason;
        }
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

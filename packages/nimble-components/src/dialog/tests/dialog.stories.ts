import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { Dialog, USER_DISMISSED } from '..';
import type { TextField } from '../../text-field';
import { ExampleContentType } from './types';
import { standardPadding } from '../../theme-provider/design-tokens';

interface DialogArgs {
    preventDismiss: boolean;
    content: ExampleContentType;
    show: undefined;
    close: undefined;
    dialogRef: Dialog<string>;
    textFieldRef: TextField;
    openAndHandleResult: (
        dialogRef: Dialog<string>,
        textFieldRef: TextField
    ) => void;
}

const simpleContent = html<DialogArgs>`
<section>
    <p>
        This is a dialog.
    </p>
    <nimble-button @click="${x => x.dialogRef.close('Close pressed')}"
        >Close</nimble-button
    >
</section>
`;

// prettier-ignore
const headerFooterContent = html<DialogArgs>`
<style>
    .example-content {
        display: flex;
        flex-direction: column;
        gap: var(${standardPadding.cssCustomProperty});
    }

    .title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 28px;
    }

    .subtitle {
        font-size: 14px;
        line-height: 18px;
        font-weight: 300;
    }
</style>
<header>
    <div class="title">Are you sure you want to delete the selected result?</div>
    <div class="subtitle">Subtitle or message in this location</div>
</header>
<section>
    Deleting a result permanently removes it from SystemLink. Are you sure you want to delete the selected result?
    <nimble-checkbox>Delete all attachments associated with the selected result</nimble-checkbox>
</section>
<footer>
    <nimble-button @click="${x => x.dialogRef.close('Cancel pressed')}" appearance="ghost">Cancel</nimble-button>
    <nimble-button @click="${x => x.dialogRef.close('OK pressed')}" appearance="outline">Delete</nimble-button>
</footer>`;

const content = {
    [ExampleContentType.simpleTextContent]: simpleContent,
    [ExampleContentType.headerContentFooter]: headerFooterContent
} as const;

const metadata: Meta<DialogArgs> = {
    title: 'Dialog',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'A modal dialog that appears centered on top of all other windows, blocking other interaction until dismissed.\n\nBy default, the first focusable control gets focus when the dialog is opened. To focus a specific element instead, set the `autofocus` attribute on that element.'
            },
            design: {
                artboardUrl:
                    'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6f1b5b4d-2e50-4f8d-ad49-e3dac564a006/specs/'
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
            ${x => content[x.content]}
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
        content: {
            options: [
                ExampleContentType.simpleTextContent,
                ExampleContentType.headerContentFooter
            ],
            control: {
                type: 'radio',
                labels: {
                    [ExampleContentType.simpleTextContent]:
                        'Simple Text Content',
                    [ExampleContentType.headerContentFooter]:
                        'Header/Content/Footer Example'
                }
            }
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
        preventDismiss: false,
        openAndHandleResult: async (dialogRef, textFieldRef) => {
            const reason = await dialogRef.show();
            textFieldRef.value = reason === USER_DISMISSED ? 'ESC pressed' : reason;
        }
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

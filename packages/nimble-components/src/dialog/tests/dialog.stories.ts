import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory, overrideWarning } from '../../utilities/tests/storybook';
import '../../all-components';
import { Dialog, USER_DISMISSED } from '..';
import type { TextField } from '../../text-field';
import { DialogWidthOptions, ExampleContentType } from './types';
import { dialogWidth } from '../../theme-provider/design-tokens';
import { scssInternalPropertySetterMarkdown, tokenNames } from '../../theme-provider/design-token-names';

interface DialogArgs {
    title: string;
    subtitle: string;
    preventDismiss: boolean;
    content: ExampleContentType;
    width: DialogWidthOptions;
    showLeftAlignedFooterButtons: boolean;
    showCenteredFooterButtons: boolean;
    showRightAlignedFooterButtons: boolean;
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

// // prettier-ignore
// const headerFooterContent = html<DialogArgs>`
// <div slot="title">${x => x.title}</div>
// <div slot="subtitle">${x => x.subtitle}</div>
// <span>This action is destructive. Are you sure you would like to do it?</span>
// <nimble-checkbox>Perform some other relevant action too</nimble-checkbox>
// ${when(x => x.showLeftAlignedFooterButtons, html<DialogArgs>`<nimble-button @click="${x => x.dialogRef.close('Back pressed')}" appearance="ghost" slot="footer-start">Back</nimble-button>`)}
// ${when(x => x.showCenteredFooterButtons, html<DialogArgs>`<nimble-button @click="${x => x.dialogRef.close('OK pressed')}" appearance="outline" slot="footer-middle">OK</nimble-button>`)}
// ${when(x => x.showRightAlignedFooterButtons, html<DialogArgs>`
//     <nimble-button @click="${x => x.dialogRef.close('Cancel pressed')}" appearance="ghost" slot="footer-end">Cancel</nimble-button>
//     <nimble-button @click="${x => x.dialogRef.close('Continue pressed')}" appearance="outline" slot="footer-end">Continue</nimble-button>
// `)}

// `;

// prettier-ignore
const headerFooterContent = html<DialogArgs>`
    <div slot="title">${x => x.title}</div>
    <div slot="subtitle">${x => x.subtitle}</div>
    <span>This action is destructive. Are you sure you would like to do it?</span>
    <nimble-checkbox>Perform some other relevant action too</nimble-checkbox>
    <!-- <nimble-button @click="${x => x.dialogRef.close('Cancel pressed')}" appearance="ghost" slot="footer">Cancel</nimble-button>
    <nimble-button @click="${x => x.dialogRef.close('Continue pressed')}" appearance="outline" slot="footer">Continue</nimble-button> -->
`;

const content = {
    [ExampleContentType.simpleTextContent]: simpleContent,
    [ExampleContentType.headerContentFooter]: headerFooterContent
} as const;

const widths = {
    [DialogWidthOptions.default]: dialogWidth.getValueFor(document.body),
    [DialogWidthOptions.small300]: '300px',
    [DialogWidthOptions.large600]: '600px',
    [DialogWidthOptions.fitContent]: 'fit-content'
} as const;

const widthDescriptionOverride = `
With SCSS properties, the dialog width can be overriden. For example:
${scssInternalPropertySetterMarkdown(tokenNames.dialogWidth, '100px')}

Dialog widths can be any [CSS width](https://developer.mozilla.org/en-US/docs/Web/CSS/width) value, including \`fit-content\`, etc.
`;

const widthDescription = `
Width of a nimble dialog.
${overrideWarning('Dialog Width', widthDescriptionOverride)}
`;

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
            ?prevent-dismiss="${x => x.preventDismiss}"
            style="${x => `${dialogWidth.cssCustomProperty}:${widths[x.width]};`}"
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
        width: {
            description: widthDescription,
            options: [
                DialogWidthOptions.default,
                DialogWidthOptions.small300,
                DialogWidthOptions.large600,
                DialogWidthOptions.fitContent
            ],
            control: {
                type: 'select',
                labels: {
                    [DialogWidthOptions.default]: `Default (${dialogWidth.getValueFor(
                        document.body
                    )})`,
                    [DialogWidthOptions.small300]: 'Small - 300px',
                    [DialogWidthOptions.large600]: 'Large - 600px',
                    [DialogWidthOptions.fitContent]: 'fit-content'
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
        title: 'Dialog title',
        subtitle: 'Dialog subtitle',
        content: ExampleContentType.headerContentFooter,
        width: DialogWidthOptions.default,
        showLeftAlignedFooterButtons: false,
        showCenteredFooterButtons: false,
        showRightAlignedFooterButtons: true,
        openAndHandleResult: async (dialogRef, textFieldRef) => {
            const reason = await dialogRef.show();
            textFieldRef.value = reason === USER_DISMISSED ? 'ESC pressed' : reason;
        }
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

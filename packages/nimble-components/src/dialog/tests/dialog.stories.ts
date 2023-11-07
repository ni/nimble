import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { Dialog, dialogTag, UserDismissed } from '..';
import { TextField, textFieldTag } from '../../text-field';
import { DialogSizeOptions, ExampleContentType } from './types';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import { buttonTag } from '../../button';
import { checkboxTag } from '../../checkbox';
import {
    dialogLargeHeight,
    dialogLargeMaxHeight,
    dialogLargeWidth,
    dialogSmallHeight,
    dialogSmallMaxHeight,
    dialogSmallWidth
} from '../../theme-provider/design-tokens';

interface DialogArgs {
    title: string;
    subtitle: string;
    headerHidden: boolean;
    footerHidden: boolean;
    includeFooterButtons: boolean;
    preventDismiss: boolean;
    content: ExampleContentType;
    size: DialogSizeOptions;
    show: undefined;
    close: undefined;
    dialogRef: Dialog<string>;
    textFieldRef: TextField;
    openAndHandleResult: (
        dialogRef: Dialog<string>,
        textFieldRef: TextField
    ) => void;
}

const shortContent = html`
    <span>
        This action is destructive. Are you sure you would like to do it?
    </span>
    <${checkboxTag}> Perform some other relevant action too </${checkboxTag}>
`;

const longContent = html`
    <span> ${loremIpsum} </span>
    <span> ${loremIpsum} </span>
    <span> ${loremIpsum} </span>
    <${checkboxTag}>Checkbox 1</${checkboxTag}>
    <${checkboxTag}>Checkbox 2</${checkboxTag}>
    <${checkboxTag}>Checkbox 3</${checkboxTag}>
    <${checkboxTag}>Checkbox 4</${checkboxTag}>
    <${checkboxTag}>Checkbox 5</${checkboxTag}>
`;

const content = {
    [ExampleContentType.shortContent]: shortContent,
    [ExampleContentType.longContent]: longContent
} as const;

const sizeDescription = `
Size of a nimble dialog.

See the Sizing section of the Usage Docs for information on controlling the size of the dialog.
`;

const widths = {
    [DialogSizeOptions.smallGrowable]: `var(${dialogSmallWidth.cssCustomProperty})`,
    [DialogSizeOptions.largeFixed]: `var(${dialogLargeWidth.cssCustomProperty})`
} as const;

const heights = {
    [DialogSizeOptions.smallGrowable]: `var(${dialogSmallHeight.cssCustomProperty})`,
    [DialogSizeOptions.largeFixed]: `var(${dialogLargeHeight.cssCustomProperty})`
} as const;

const maxHeights = {
    [DialogSizeOptions.smallGrowable]: `var(${dialogSmallMaxHeight.cssCustomProperty})`,
    [DialogSizeOptions.largeFixed]: `var(${dialogLargeMaxHeight.cssCustomProperty})`
} as const;

const metadata: Meta<DialogArgs> = {
    title: 'Components/Dialog',
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
            .first-button {
                margin-right: auto;
            }
            ${dialogTag}::part(control) {
                ${x => `
                    width:${widths[x.size]};
                    height:${heights[x.size]};
                    max-height:${maxHeights[x.size]};
                `}
            }
        </style>
        <${dialogTag}
            ${ref('dialogRef')}
            ?prevent-dismiss="${x => x.preventDismiss}"
            ?header-hidden="${x => x.headerHidden}"
            ?footer-hidden="${x => x.footerHidden}"
        >
            <span slot="title">${x => x.title}</span>
            <span slot="subtitle">${x => x.subtitle}</span>

            ${x => content[x.content]}
            ${when(
        x => x.includeFooterButtons,
        html<DialogArgs>`
                    <${buttonTag}
                        @click="${x => x.dialogRef.close('Back pressed')}"
                        appearance="ghost"
                        slot="footer"
                        class="first-button"
                    >
                        Back
                    </${buttonTag}>
                    <${buttonTag}
                        @click="${x => x.dialogRef.close('Cancel pressed')}"
                        appearance="ghost"
                        slot="footer"
                    >
                        Cancel
                    </${buttonTag}>
                    <${buttonTag}
                        @click="${x => x.dialogRef.close('Continue pressed')}"
                        appearance="outline"
                        slot="footer"
                    >
                        Continue
                    </${buttonTag}>
                `
    )}
        </${dialogTag}>
        <${buttonTag}
            id="open"
            @click="${x => x.openAndHandleResult(x.dialogRef, x.textFieldRef)}"
        >
            Open
        </${buttonTag}>
        <div>
            <${textFieldTag} ${ref('textFieldRef')} readonly>
                Close reason
            </${textFieldTag}>
        </div>
    `),
    argTypes: {
        preventDismiss: {
            name: 'prevent-dismiss'
        },
        title: {
            description:
                'Primary text that is displayed in the header when `header-hidden` is not set. Dialogs should **always include a title** even when `header-hidden` is set. The title is used to provide an accessible name to assistive technologies regardless of the value of `header-hidden`.<br><br>The title should be specified using an `inline` element, such as a `<span>`.'
        },
        subtitle: {
            description:
                'Secondary text that is displayed in the header when `header-hidden` is not set. If a dialog has an appropriate value to set for the subtitle, it should be included even when `header-hidden` is set. If the subtitle is set, it is used with the title to provide an accessible name to assistive technologies regardless of the value of `header-hidden`.<br><br>The subtitle should be specified using an `inline` element, such as a `<span>`.'
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
        content: {
            options: [
                ExampleContentType.shortContent,
                ExampleContentType.longContent
            ],
            control: {
                type: 'radio',
                labels: {
                    [ExampleContentType.shortContent]: 'Short content',
                    [ExampleContentType.longContent]: 'Long content'
                }
            }
        },
        size: {
            description: sizeDescription,
            options: [
                DialogSizeOptions.smallGrowable,
                DialogSizeOptions.largeFixed
            ],
            control: {
                type: 'radio',
                labels: {
                    [DialogSizeOptions.smallGrowable]: 'Small growable',
                    [DialogSizeOptions.largeFixed]: 'Large fixed'
                }
            }
        },
        show: {
            name: 'show()',
            description:
                'Call this member function to open the dialog. It returns a `Promise` that is resolved when the dialog is closed. The resolved value is either the reason passed to `close(...)` or the symbol `UserDismissed` if the dialog was dismissed via the ESC key.'
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
        content: ExampleContentType.shortContent,
        size: DialogSizeOptions.smallGrowable,
        openAndHandleResult: (dialogRef, textFieldRef) => {
            void (async () => {
                const reason = await dialogRef.show();
                textFieldRef.value = reason === UserDismissed ? 'ESC pressed' : reason;
            })();
        }
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

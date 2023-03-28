import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';

import { DrawerWidthOptions, ExampleContentType } from './types';
import {
    createUserSelectedThemeStory,
    overrideWarning
} from '../../utilities/tests/storybook';
import {
    tokenNames,
    scssInternalPropertySetterMarkdown
} from '../../theme-provider/design-token-names';
import {
    drawerWidth,
    standardPadding
} from '../../theme-provider/design-tokens';
import { DrawerLocation } from '../types';
import { Drawer, drawerTag, UserDismissed } from '..';
import { TextField, textFieldTag } from '../../text-field';
import { buttonTag } from '../../button';
import { listOptionTag } from '../../list-option';
import { numberFieldTag } from '../../number-field';
import { selectTag } from '../../select';

interface DrawerArgs {
    location: DrawerLocation;
    preventDismiss: boolean;
    content: ExampleContentType;
    width: DrawerWidthOptions;
    show: undefined;
    close: undefined;
    drawerRef: Drawer<string>;
    textFieldRef: TextField;
    openAndHandleResult: (
        drawerRef: Drawer<string>,
        textFieldRef: TextField
    ) => Promise<void> | undefined;
}

const simpleContent = html<DrawerArgs>`
    <section>
        <p>
            This is a drawer which can slide in from either side of the screen
            and display custom content.
        </p>
        <${buttonTag} @click="${x => x.drawerRef.close('Close pressed')}"
            >Close</${buttonTag}
        >
    </section>
`;

// prettier-ignore
const headerFooterContent = html<DrawerArgs>`
    <style>
        .example-content {
            display: flex;
            flex-direction: column;
            gap: var(${standardPadding.cssCustomProperty});
        }

        footer {
            gap: var(${standardPadding.cssCustomProperty});
        }
    </style>
    <header>Header</header>
    <section>
        <p>This is a drawer with <code>header</code>, <code>section</code>, and <code>footer</code> elements.</p>
        <p>When placed in a <code>nimble-drawer</code> they will be automatically styled for you!</p>

        <div class="example-content">
            <${numberFieldTag}>I am not auto focused</${numberFieldTag}>
            <${numberFieldTag} autofocus>I am auto focused</${numberFieldTag}>
            <${selectTag}>
                <${listOptionTag} value="1">option 1</${listOptionTag}>
                <${listOptionTag} value="2">option 2</${listOptionTag}>
                <${listOptionTag} value="3">option 3</${listOptionTag}>
            </${selectTag}>
        </div>

        <p style="height: 1000px;">
            This is a tall piece of content so you can see how scrolling behaves. Scroll down to see more 👇.
        </p>
        <p>
            You made it to the end! 🎉
        </p>
    </section>
    <footer>
        <${buttonTag} @click="${x => x.drawerRef.close('Cancel pressed')}" appearance="ghost">Cancel</${buttonTag}>
        <${buttonTag} @click="${x => x.drawerRef.close('OK pressed')}" appearance="outline">OK</${buttonTag}>
    </footer>`;

const content = {
    [ExampleContentType.simpleTextContent]: simpleContent,
    [ExampleContentType.headerContentFooter]: headerFooterContent
} as const;

const widths = {
    [DrawerWidthOptions.default]: drawerWidth.getValueFor(document.body),
    [DrawerWidthOptions.small300]: '300px',
    [DrawerWidthOptions.medium500]: '500px',
    [DrawerWidthOptions.fitContent]: 'fit-content'
} as const;

const widthDescriptionOverride = `
With SCSS properties, the drawer width can be overriden. For example:
${scssInternalPropertySetterMarkdown(tokenNames.drawerWidth, '100px')}

Drawer widths can be any [CSS width](https://developer.mozilla.org/en-US/docs/Web/CSS/width) value, including \`fit-content\`, etc.
`;

const widthDescription = `
Width of a nimble drawer.
${overrideWarning('Drawer Width', widthDescriptionOverride)}
`;

const metadata: Meta<DrawerArgs> = {
    title: 'Drawer',
    tags: ['autodocs'],

    parameters: {
        docs: {
            description: {
                component:
                    'Specialized dialog designed to slide in from either side of the page. Typically used for a configuration pane.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        },
        actions: {
            handles: []
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${drawerTag}
            ${ref('drawerRef')}
            ?prevent-dismiss="${x => x.preventDismiss}"
            location="${x => x.location}"
            style="${x => `${drawerWidth.cssCustomProperty}:${widths[x.width]};`}"
        >
            ${x => content[x.content]}
        </${drawerTag}>
        <${buttonTag}
            @click="${x => x.openAndHandleResult(x.drawerRef, x.textFieldRef)}"
        >
            Open
        </${buttonTag}>
        <div>
            <${textFieldTag}
                ${ref('textFieldRef')}
                readonly
            >
                Close reason
            </${textFieldTag}>
        </div>
    `),
    argTypes: {
        location: {
            options: [DrawerLocation.left, DrawerLocation.right],
            control: { type: 'radio' }
        },
        preventDismiss: {
            name: 'prevent-dismiss',
            description:
                'A boolean attribute to configure whether or not the drawer is dismissible via the `Esc` key, or any other dismiss action that is supported in the future'
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
                DrawerWidthOptions.default,
                DrawerWidthOptions.small300,
                DrawerWidthOptions.medium500,
                DrawerWidthOptions.fitContent
            ],
            control: {
                type: 'select',
                labels: {
                    [DrawerWidthOptions.default]: `Default (${drawerWidth.getValueFor(
                        document.body
                    )})`,
                    [DrawerWidthOptions.small300]: 'Small - 300px',
                    [DrawerWidthOptions.medium500]: 'Medium - 500px',
                    [DrawerWidthOptions.fitContent]: 'fit-content'
                }
            }
        },
        show: {
            name: 'show()',
            description:
                'Call this member function to open the drawer. It returns a `Promise` that is resolved when the drawer is closed. The resolved value is either the reason passed to `close(...)` or the symbol `UserDismissed` if the drawer was dismissed via the `Esc` key.'
        },
        close: {
            name: 'close(reason)',
            description:
                'Call this member function to close the drawer. It takes an optional `reason` value which can be any type. This value is returned from `show()` via a `Promise`'
        },
        drawerRef: {
            table: {
                disable: true
            }
        },
        textFieldRef: {
            table: {
                disable: true
            }
        },
        openAndHandleResult: {
            table: {
                disable: true
            }
        }
    },
    args: {
        location: DrawerLocation.left,
        preventDismiss: false,
        content: ExampleContentType.simpleTextContent,
        width: DrawerWidthOptions.default,
        drawerRef: undefined,
        textFieldRef: undefined,
        openAndHandleResult: async (drawerRef, textFieldRef) => {
            const reason = await drawerRef.show();
            textFieldRef.value = reason === UserDismissed ? 'User dismissed' : reason;
        }
    }
};

export default metadata;

export const drawer: StoryObj<DrawerArgs> = {};

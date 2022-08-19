import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
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
import { Drawer, USER_DISMISSED } from '..';
import '../../all-components';
import type { TextField } from '../../text-field';

interface DrawerArgs {
    location: DrawerLocation;
    preventDismiss: boolean;
    content: ExampleContentType;
    width: DrawerWidthOptions;
    drawerRef: Drawer<string>;
    textFieldRef: TextField;
    openAndHandleResult: (
        drawerRef: Drawer<string>,
        textFieldRef: TextField
    ) => void;
}

const simpleContent = html<DrawerArgs>`
    <section>
        <p>
            This is a drawer which can slide in from either side of the screen
            and display custom content.
        </p>
        <nimble-button @click="${x => x.drawerRef.close('Close pressed')}">Close</nimble-button>
    </section>
`;

// prettier-ignore
const headerFooterContent = html<DrawerArgs>`
    <style>
        .cancel-button {
            margin-right: var(${standardPadding.cssCustomProperty});
        }
    </style>
    <header>Header</header>
    <section>
        <p>This is a drawer with <code>header</code>, <code>section</code>, and <code>footer</code> elements.</p>
        <p>When placed in a <code>nimble-drawer</code> they will be automatically styled for you!</p>

        <div style="display: flex; flex-direction: column; gap: 16px">
            <nimble-number-field>I am not auto focused</nimble-number-field>
            <nimble-number-field autofocus>I am auto focused</nimble-number-field>
            <nimble-select>
                <nimble-list-option value="1">option 1</nimble-list-option>
                <nimble-list-option value="2">option 2</nimble-list-option>
                <nimble-list-option value="3">option 3</nimble-list-option>
            </nimble-select>
        </div>

        <p style="height: 1000px;">
            This is a tall piece of content so you can see how scrolling behaves. Scroll down to see more 👇.
        </p>
        <p>
            You made it to the end! 🎉
        </p>
    </section>
    <footer>
        <nimble-button @click="${x => x.drawerRef.close('Cancel pressed')}" appearance="ghost" class="cancel-button">Cancel</nimble-button>
        <nimble-button @click="${x => x.drawerRef.close('OK pressed')}" appearance="outline">OK</nimble-button>
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
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Specialized dialog designed to slide in from either side of the page. Typically contains navigation or configuration panes.'
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
        <nimble-drawer
            ${ref('drawerRef')}
            ?prevent-dismiss="${x => x.preventDismiss}"
            location="${x => x.location}"
            style="${x => `${drawerWidth.cssCustomProperty}:${widths[x.width]};`}"
        >
            ${x => content[x.content]}
        </nimble-drawer>
        <div
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; gap: 16px;"
        >
        <nimble-button
            @click="${x => x.openAndHandleResult(x.drawerRef, x.textFieldRef)}"
            class="code-hide"
        >
            Open
        </nimble-button><div>
        <nimble-text-field
            ${ref('textFieldRef')}
            readonly
            class="code-hide"
        >
            Close reason
        </nimble-text-field>
    `),
    argTypes: {
        location: {
            options: [DrawerLocation.left, DrawerLocation.right],
            control: { type: 'radio' }
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
            textFieldRef.value = reason === USER_DISMISSED ? 'User dismissed' : reason;
        }
    }
};

export default metadata;

export const drawer: StoryObj<DrawerArgs> = {};
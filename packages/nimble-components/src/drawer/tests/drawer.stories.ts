import { html, ViewTemplate } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    createRenderer,
    overrideWarning
} from '../../utilities/tests/storybook';
import '../../button';
import '..';
import {
    tokenNames,
    scssInternalPropertySetterMarkdown
} from '../../theme-provider/design-token-names';
import {
    drawerWidth,
    standardPadding
} from '../../theme-provider/design-tokens';
import { DrawerLocation, DrawerState } from '../types';

enum ExampleContentType {
    SimpleTextContent = 'SimpleTextContent',
    HeaderContentFooter = 'HeaderContentFooter'
}

enum DrawerWidthOptions {
    Default = 'Default',
    Small300 = 'Small300',
    Medium500 = 'Medium500',
    FitContent = 'FitContent'
}

interface DrawerArgs {
    location: DrawerLocation;
    state: DrawerState;
    modal: string;
    preventDismiss: boolean;
    content: ExampleContentType;
    width: DrawerWidthOptions;
}

const simpleContent = html`
    <section>
        <p>
            This is a drawer which can slide in from either side of the screen
            and display custom content.
        </p>
        <nimble-button onclick="myNimbleDrawer.hide()">Close</nimble-button>
    </section>
`;

// prettier-ignore
const headerFooterContent = html`
    <style>
        .cancel-button {
            margin-right: var(${standardPadding.cssCustomProperty});
        }
    </style>
    <header>Header</header>
    <section>
        <p>This is a drawer with <code>header</code>, <code>section</code>, and <code>footer</code> elements.</p>
        <p>When placed in a <code>nimble-drawer</code> they will be automatically styled for you!</p>

        <p style="height: 1000px;">
            This is a tall piece of content so you can see how scrolling behaves. Scroll down to see more 👇.
        </p>
        <p>
            You made it to the end! 🎉
        </p>
    </section>
    <footer>
        <nimble-button onclick="myNimbleDrawer.hide()" appearance="ghost" class="cancel-button">Cancel</nimble-button>
        <nimble-button onclick="myNimbleDrawer.hide()" appearance="outline">OK</nimble-button>
    </footer>`;

const content: { readonly [key in ExampleContentType]: ViewTemplate } = {
    [ExampleContentType.SimpleTextContent]: simpleContent,
    [ExampleContentType.HeaderContentFooter]: headerFooterContent
};

const widths: { readonly [key in DrawerWidthOptions]: string } = {
    [DrawerWidthOptions.Default]: drawerWidth.getValueFor(document.body),
    [DrawerWidthOptions.Small300]: '300px',
    [DrawerWidthOptions.Medium500]: '500px',
    [DrawerWidthOptions.FitContent]: 'fit-content'
};

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
            handles: ['cancel']
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-drawer id="myNimbleDrawer"
            modal="${x => x.modal}"
            ?prevent-dismiss="${x => x.preventDismiss}"
            location="${x => x.location}"
            state="${x => x.state}" 
            style="${x => `${drawerWidth.cssCustomProperty}:${widths[x.width]};`}"
        >
            ${x => content[x.content]}
        </nimble-drawer>
        <nimble-button
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
            onclick="myNimbleDrawer.state = myNimbleDrawer.hidden ? '${DrawerState.Opening}' : '${DrawerState.Closing}'"
        >
            Show/Hide Drawer (animated)
        </nimble-button>
    `),
    argTypes: {
        location: {
            options: [DrawerLocation.Left, DrawerLocation.Right],
            control: { type: 'radio' }
        },
        state: {
            options: [
                DrawerState.Opening,
                DrawerState.Opened,
                DrawerState.Closing,
                DrawerState.Closed
            ],
            control: { type: 'select' }
        },
        modal: {
            options: ['true', 'false'],
            control: { type: 'select' },
            description:
                'Note: The value is the string "true" or "false" unlike normal boolean attributes.'
        },
        content: {
            options: [
                ExampleContentType.SimpleTextContent,
                ExampleContentType.HeaderContentFooter
            ],
            control: {
                type: 'radio',
                labels: {
                    [ExampleContentType.SimpleTextContent]:
                        'Simple Text Content',
                    [ExampleContentType.HeaderContentFooter]:
                        'Header/Content/Footer Example'
                }
            }
        },
        width: {
            description: widthDescription,
            options: [
                DrawerWidthOptions.Default,
                DrawerWidthOptions.Small300,
                DrawerWidthOptions.Medium500,
                DrawerWidthOptions.FitContent
            ],
            control: {
                type: 'select',
                labels: {
                    [DrawerWidthOptions.Default]: `Default (${drawerWidth.getValueFor(
                        document.body
                    )})`,
                    [DrawerWidthOptions.Small300]: 'Small - 300px',
                    [DrawerWidthOptions.Medium500]: 'Medium - 500px',
                    [DrawerWidthOptions.FitContent]: 'fit-content'
                }
            }
        }
    },
    args: {
        location: DrawerLocation.Left,
        state: DrawerState.Opening,
        modal: 'true',
        preventDismiss: false,
        content: ExampleContentType.SimpleTextContent,
        width: DrawerWidthOptions.Default
    }
};

export default metadata;

export const drawer: StoryObj<DrawerArgs> = {};

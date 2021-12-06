import { html, ViewTemplate } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import '../../button/index';
import '../index';
import { DrawerLocation, DrawerState } from '../types';

enum ExampleContentType {
    SimpleTextContent = 'SimpleTextContent',
    HeaderContentFooter = 'HeaderContentFooter'
}

interface DrawerArgs {
    location: DrawerLocation;
    state: DrawerState;
    modal: string;
    preventDismiss: boolean;
    content: ExampleContentType;
}

const simpleContent = html`
    <section>
        This is a drawer which can slide in from either side of the screen and
        display custom content.
    </section>
`;

// prettier-ignore
const headerFooterContent = html`
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
        <nimble-button appearance="ghost">Cancel</nimble-button>
        <nimble-button appearance="outline">OK</nimble-button>
    </footer>`;

const content: { [key in ExampleContentType]: ViewTemplate } = {
    [ExampleContentType.SimpleTextContent]: simpleContent,
    [ExampleContentType.HeaderContentFooter]: headerFooterContent
};

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
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-drawer id="myNimbleDrawer"
            modal="${x => x.modal}"
            ?prevent-dismiss="${x => x.preventDismiss}"
            location="${x => x.location}"
            state="${x => x.state}"
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
        }
    },
    args: {
        location: DrawerLocation.Left,
        state: DrawerState.Opening,
        modal: 'true',
        preventDismiss: false,
        content: ExampleContentType.SimpleTextContent
    }
};

export default metadata;

export const drawer: StoryObj = {};

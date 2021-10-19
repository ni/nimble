import { html, ref } from '@microsoft/fast-element';
import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import '../../button/index';
import '../index';
import { DrawerLocation, DrawerState } from '../types';
import type { Drawer } from '../index';

enum ExampleContentType {
    SimpleTextContent = 'SimpleTextContent',
    HeaderContentFooter = 'HeaderContentFooter'
}

interface DrawerArgs {
    location: DrawerLocation;
    state: DrawerState;
    modal: boolean;
    preventDismiss: boolean;
    content: ExampleContentType;
    drawer: Drawer;
}

const simpleDrawerContent = '<section>Example Content</section>';

// prettier-ignore
const drawerHeaderFooterContentTemplate = html`
    <header>Header</header>
    <section>
        <p>Drawer Example with Header and Footer</p>
        <p>
            Uses header, section, footer HTML elements
            <br/>
            (Drawer element includes styling for them)
        </p>
        <div style="height: 1000px;">
            (Large-height content to ensure content scrollbar appears)
        </div>
    </section>
    <footer>
        <nimble-button appearance="ghost">Cancel</nimble-button>
        <nimble-button appearance="outline">OK</nimble-button>
    </footer>`;
const drawerHeaderFooterContent = drawerHeaderFooterContentTemplate.html as string;

const metadata: Meta<DrawerArgs> = {
    title: 'Drawer',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-drawer ${ref('drawer')}
            ?modal="${x => x.modal}"
            ?prevent-dismiss="${x => x.preventDismiss}"
            location="${x => x.location}"
            state="${x => x.state}"            
            :innerHTML="${x => x.content}">
        </nimble-drawer>
        <nimble-button
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
            @click="${({ drawer }) => { drawer.state = drawer.hidden ? DrawerState.Opening : DrawerState.Closing; }}"
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
        content: {
            options: [
                ExampleContentType.SimpleTextContent,
                ExampleContentType.HeaderContentFooter
            ],
            mapping: {
                [ExampleContentType.SimpleTextContent]: simpleDrawerContent,
                [ExampleContentType.HeaderContentFooter]:
                    drawerHeaderFooterContent
            },
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
        state: DrawerState.Opened,
        modal: true,
        preventDismiss: false,
        content: ExampleContentType.SimpleTextContent
    }
};

export default metadata;

export const drawer: Story<DrawerArgs> = {};

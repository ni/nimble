import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface DialogArgs {
    'prevent-dismiss': boolean;
}

const metadata: Meta<DialogArgs> = {
    title: 'Dialog',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'TODO'
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-dialog
            ?prevent-dismiss="${x => x['prevent-dismiss']}"
        >
            <h1>Here is a dialog</h1>
            <p>It can have some detailed message here.</p>
            <nimble-button onclick='document.querySelector("nimble-dialog").close()'>Cancel</nimble-button>
        </nimble-dialog>
        <nimble-button onclick='document.querySelector("nimble-dialog").showModal().then(() => console.log("Dialog closed"))'>Open</nimble-button>
    `),
    argTypes: {
    },
    args: {
        'prevent-dismiss': false
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface DialogArgs {}

const metadata: Meta<DialogArgs> = {
    title: 'Dialog',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#checkbox) – The dual-state checkbox is the most common type, as it allows the user to toggle between two choices: checked and not checked.'
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-dialog>
            <h1>Here is a dialog</h1>
            <p>It can have some detailed message here.</p>
            <nimble-button onclick='document.querySelector("nimble-dialog").close()'>Cancel</nimble-button>
        </nimble-dialog>
        <nimble-button onclick='document.querySelector("nimble-dialog").showModal()'>Open</nimble-button>
    `),
    args: {
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    createUserSelectedThemeStory
} from '../../utilities/tests/storybook';
import '../../all-components';
import type { Dialog } from '..';

interface DialogArgs {
    dialogRef: Dialog;
    modal: boolean;
    'trap-focus': boolean;
    hidden: boolean;
    toggleDialog: (x: Dialog) => void;
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
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-dialog
            ${ref('dialogRef')}
            modal="${x => x.modal.toString()}"
            trap-focus="${x => x['trap-focus'].toString()}"
            hidden="${x => x.hidden.toString()}"
            style="border: 1px solid var(--ni-nimble-popup-border-color); box-shadow: 0px 5px 15px var(--ni-nimble-popup-box-shadow-color)"
        >
            <div style="padding: 15px">
                ${when(x => x.modal, html`<h1>I'm a modal Dialog!</h1>`)}
                ${when(x => !x.modal, html`<h1>I'm a non-modal Dialog!</h1>`)}
                <p>Press the button to hide me</p>
                <nimble-button @click="${x => x.dialogRef.hide()}">Hide</nimble-button>
            </div>
        </nimble-dialog>
        <nimble-button
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
            @click="${x => x.toggleDialog(x.dialogRef)}"
        >
            Show/Hide Dialog
        </nimble-button>
    `),
    argTypes: {
        toggleDialog: {
            table: {
                disable: true
            }
        }
    },
    args: {
        modal: true,
        'trap-focus': true,
        hidden: false,
        toggleDialog: (x: Dialog): void => x.hidden ? x.show() : x.hide()
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

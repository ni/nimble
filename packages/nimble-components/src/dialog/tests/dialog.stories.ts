import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import type { Dialog } from '..';

interface DialogArgs {
    dialogRef: Dialog;
    modal: boolean;
    'trap-focus': boolean;
    hidden: boolean;
    'aria-label': string;
    '--ni-nimble-dialog-background-color': string;
    toggleDialog: (x: Dialog) => void;
}

const metadata: Meta<DialogArgs> = {
    title: 'Dialog',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'A dialog is a window overlaid on either the primary window or another dialog window. May be modal, which prevents interaction with other windows.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${when(x => x['--ni-nimble-dialog-background-color'], html`
        <style>
            nimble-dialog {
                --ni-nimble-dialog-background-color: ${(x: DialogArgs) => x['--ni-nimble-dialog-background-color']}
            }
        </style>`)}
        <nimble-dialog
            ${ref('dialogRef')}
            modal="${x => x.modal.toString()}"
            trap-focus="${x => x['trap-focus'].toString()}"
            hidden="${x => x.hidden.toString()}"
            aria-label="${x => x['aria-label']}"
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
        '--ni-nimble-dialog-background-color': {
            options: [
                undefined,
                'var(--ni-nimble-application-background-color)',
                'cyan',
                'yellow'
            ],
            control: { type: 'select' },
            table: {
                defaultValue: {
                    summary: 'var(--ni-nimble-application-background-color)'
                }
            }
        },
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
        'aria-label': 'Example dialog',
        '--ni-nimble-dialog-background-color': undefined,
        toggleDialog: (x: Dialog): void => (x.hidden ? x.show() : x.hide())
    }
};

export default metadata;

export const dialog: StoryObj<DialogArgs> = {};

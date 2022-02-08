import { html } from '@microsoft/fast-element';
import { TextAreaResize } from '@microsoft/fast-foundation';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import { TextAreaAppearance } from '../types';

interface TextAreaArgs {
    appearance: TextAreaAppearance;
    label: string;
    value: string;
    readonly: boolean;
    disabled: boolean;
    spellcheck: boolean;
    resize: TextAreaResize;
    rows: number;
}

const metadata: Meta<TextAreaArgs> = {
    title: 'Text Area',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: 'A basic multi-line text area.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/specs/'
        },
        actions: {
            handles: ['change']
        }
    },
    render: createRenderer(html`
        <nimble-text-area
            appearance="${x => x.appearance}"
            placeholder="${x => x.label}"
            value="${x => x.value}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
            ?spellcheck="${x => x.spellcheck}"
            resize="${x => x.resize}"
            rows="${x => x.rows}"
        >
            ${x => x.label}
        </nimble-text-area>
    `),
    argTypes: {
        appearance: {
            options: Object.values(TextAreaAppearance),
            control: { type: 'radio' }
        },
        resize: {
            options: Object.values(TextAreaResize),
            control: { type: 'select' }
        }
    },
    args: {
        appearance: TextAreaAppearance.Outline,
        label: 'default label',
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        readonly: false,
        disabled: false,
        spellcheck: false,
        resize: TextAreaResize.both,
        rows: 0
    }
};

export default metadata;

export const textArea: StoryObj<TextAreaArgs> = {
    args: { label: 'Text Area' }
};

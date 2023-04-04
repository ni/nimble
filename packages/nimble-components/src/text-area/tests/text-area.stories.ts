import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { TextAreaAppearance, TextAreaResize } from '../types';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import { textAreaTag } from '..';

interface TextAreaArgs {
    appearance: TextAreaAppearance;
    label: string;
    placeholder: string;
    value: string;
    readonly: boolean;
    disabled: boolean;
    spellcheck: boolean;
    resize: TextAreaResize;
    rows: number;
    cols: number;
    maxlength: number;
}

const metadata: Meta<TextAreaArgs> = {
    title: 'Text Area',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component:
                    'A multi-line text input control. The text area is often used in a form to collect user inputs like comments or reviews.'
            }
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html`
        <${textAreaTag}
            appearance="${x => x.appearance}"
            placeholder="${x => x.placeholder}"
            :value="${x => x.value}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
            spellcheck="${x => x.spellcheck}"
            resize="${x => x.resize}"
            rows="${x => x.rows}"
            cols="${x => x.cols}"
            maxlength="${x => x.maxlength}"
        >
            ${x => x.label}
        </${textAreaTag}>
    `),
    argTypes: {
        appearance: {
            options: Object.values(TextAreaAppearance),
            control: { type: 'radio' },
            table: {
                defaultValue: { summary: 'outline' }
            }
        },
        resize: {
            description: 'Direction(s) the text area is sizeable by the user',
            options: Object.values(TextAreaResize),
            control: { type: 'select' },
            table: {
                defaultValue: { summary: 'none' }
            }
        },
        rows: {
            description: 'Number of visible rows of text.'
        },
        cols: {
            description:
                'Visible width of the text, in average character widths',
            table: {
                defaultValue: { summary: '20' }
            }
        },
        maxlength: {
            description:
                'Maximum number of characters that may be entered by the user'
        }
    },
    args: {
        appearance: TextAreaAppearance.outline,
        label: 'default label',
        placeholder: 'Placeholder',
        value: loremIpsum,
        readonly: false,
        disabled: false,
        spellcheck: false,
        resize: TextAreaResize.both,
        rows: 3,
        cols: 20,
        maxlength: 500
    }
};

export default metadata;

export const outlineTextArea: StoryObj<TextAreaArgs> = {
    args: { label: 'Outline Text Area', appearance: TextAreaAppearance.outline }
};

export const blockTextArea: StoryObj<TextAreaArgs> = {
    args: { label: 'Block Text Area', appearance: TextAreaAppearance.block }
};

import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
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
    errorVisible: boolean;
    errorText: string;
    spellcheck: boolean;
    resize: TextAreaResize;
    rows: number;
    cols: number;
    maxlength: number;
}

const metadata: Meta<TextAreaArgs> = {
    title: 'Components/Text Area',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
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
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
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
            description:
                'Direction(s) the text area is sizeable by the user. Setting a fixed `height` and `width` on the text area is not supported while it is sizeable. You may instead use `rows` and `cols` to set an initial size.',
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
        },
        errorVisible: {
            description:
                'Whether the text area should be styled to indicate that it is in an invalid state'
        },
        errorText: {
            description:
                'A message to be displayed when the text area is in the invalid state explaining why the value is invalid'
        }
    },
    args: {
        appearance: TextAreaAppearance.outline,
        label: 'default label',
        placeholder: 'Placeholder',
        value: loremIpsum,
        readonly: false,
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
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

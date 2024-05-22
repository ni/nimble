import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { TextAreaAppearance, TextAreaResize } from '@ni/nimble-components/dist/esm/text-area/types';
import { apiCategory, appearanceDescription, createUserSelectedThemeStory, disabledDescription, errorTextDescription, errorVisibleDescription, placeholderDescription, slottedLabelDescription } from '../../utilities/storybook';
import { loremIpsum } from '../../utilities/lorem-ipsum';

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
    change: undefined;
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
            description: appearanceDescription({ componentName: 'text area' }),
            table: { category: apiCategory.attributes }
        },
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'text area' })}`,
            table: { category: apiCategory.slots }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'text area' }),
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The string displayed in the text area.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        readonly: {
            description: 'Disallows input on the text area while maintaining enabled appearance.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'text area' }),
            table: { category: apiCategory.attributes }
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        spellcheck: {
            description: 'Specifies whether the text area is subject to spell checking by the underlying browser/OS.',
            table: { category: apiCategory.attributes }
        },
        resize: {
            description:
                'Direction(s) the text area is sizeable by the user. Setting a fixed `height` and `width` on the text area is not supported while it is sizeable. You may instead use `rows` and `cols` to set an initial size.',
            options: Object.values(TextAreaResize),
            control: { type: 'select' },
            table: { category: apiCategory.attributes }

        },
        rows: {
            description: 'Number of visible rows of text.',
            table: { category: apiCategory.attributes }
        },
        cols: {
            description:
                'Visible width of the text, in average character widths',
            table: { category: apiCategory.attributes }

        },
        maxlength: {
            description:
                'Maximum number of characters that may be entered by the user',
            table: { category: apiCategory.attributes }
        },
        change: {
            description: 'Event emitted when the user commits a new value to the text area.',
            table: { category: apiCategory.events }
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

import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import { fvSearchInputTag } from '@ni/ok-components/dist/esm/fv-search-input';
import { FvSearchInputAppearance } from '@ni/ok-components/dist/esm/fv-search-input/types';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    appearanceDescription,
    apiCategory,
    createUserSelectedThemeStory,
    okWarning,
    placeholderDescription
} from '../../utilities/storybook';

interface SearchInputArgs {
    appearance: FvSearchInputAppearance;
    placeholder: string;
    value: string;
    input?: (e: Event) => void;
    change?: (e: Event) => void;
}

const searchInputContentStyle = `
    font: var(${bodyFont.cssCustomProperty});
    color: var(${bodyFontColor.cssCustomProperty});
`;

const metadata: Meta<SearchInputArgs> = {
    title: 'Ok/Fv Search Input',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['input', 'change']
        }
    },
    render: createUserSelectedThemeStory(html<SearchInputArgs>`
        ${okWarning({
            componentName: 'Fv Search Input',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <div style="width: 320px; padding: 16px; ${searchInputContentStyle}">
            <${fvSearchInputTag}
                appearance="${x => x.appearance}"
                placeholder="${x => x.placeholder}"
                value="${x => x.value}"
            ></${fvSearchInputTag}>
        </div>
    `),
    argTypes: {
        appearance: {
            description: appearanceDescription({ componentName: 'Fv Search Input' }),
            options: Object.values(FvSearchInputAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'Fv Search Input' }),
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The current text rendered in the Fv Search Input.',
            table: { category: apiCategory.attributes }
        },
        input: {
            table: { category: apiCategory.events },
            control: false
        },
        change: {
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        appearance: FvSearchInputAppearance.outline,
        placeholder: 'Search',
        value: ''
    }
};

export default metadata;

export const defaultStory: StoryObj<SearchInputArgs> = {
    name: 'Fv Search Input'
};
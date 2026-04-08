import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { searchInputTag } from '@ni/ok-components/dist/esm/search-input';
import { SearchInputAppearance } from '@ni/ok-components/dist/esm/search-input/types';
import {
    appearanceDescription,
    apiCategory,
    createUserSelectedThemeStory,
    placeholderDescription
} from '../../utilities/storybook';

interface SearchInputArgs {
    appearance: SearchInputAppearance;
    placeholder: string;
    value: string;
    input?: (e: Event) => void;
    change?: (e: Event) => void;
}

const metadata: Meta<SearchInputArgs> = {
    title: 'Ok/Search Input',
    render: createUserSelectedThemeStory(html<SearchInputArgs>`
        <div style="width: 320px; padding: 16px;">
            <${searchInputTag}
                appearance="${x => x.appearance}"
                placeholder="${x => x.placeholder}"
                value="${x => x.value}"
            ></${searchInputTag}>
        </div>
    `),
    argTypes: {
        appearance: {
            description: appearanceDescription({ componentName: 'search input' }),
            options: Object.values(SearchInputAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'search input' }),
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The current text rendered in the search input.',
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
        appearance: SearchInputAppearance.outline,
        placeholder: 'Search',
        value: ''
    }
};

export default metadata;

export const defaultStory: StoryObj<SearchInputArgs> = {
    name: 'default'
};
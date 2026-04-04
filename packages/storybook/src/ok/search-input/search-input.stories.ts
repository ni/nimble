import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fn } from 'storybook/test';
import { searchInputTag } from '@ni/ok-components/dist/esm/search-input';
import { SearchInputAppearance } from '@ni/ok-components/dist/esm/search-input/types';
import {
    appearanceDescription,
    apiCategory,
    createUserSelectedThemeStory,
    placeholderDescription
} from '../../utilities/storybook';

interface SearchInputArgs {
    appearance: keyof typeof SearchInputAppearance;
    placeholder: string;
    initialSearchValue: string;
    input: (e: Event) => void;
    change: (e: Event) => void;
}

const metadata: Meta<SearchInputArgs> = {
    title: 'Ok/Search Input',
    render: createUserSelectedThemeStory(html<SearchInputArgs>`
        <div style="width: 320px; padding: 16px;">
            <${searchInputTag}
                appearance="${x => SearchInputAppearance[x.appearance]}"
                placeholder="${x => x.placeholder}"
                value="${x => x.initialSearchValue}"
                @input="${(x, c) => x.input(c.event)}"
                @change="${(x, c) => x.change(c.event)}"
            ></${searchInputTag}>
        </div>
    `),
    argTypes: {
        appearance: {
            description: appearanceDescription({ componentName: 'search input' }),
            options: Object.keys(SearchInputAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'search input' }),
            table: { category: apiCategory.attributes }
        },
        initialSearchValue: {
            description: 'Initial text rendered in the search input.',
            table: { category: apiCategory.nonAttributeProperties }
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
        appearance: 'outline',
        placeholder: 'Search',
        initialSearchValue: '',
        input: fn(),
        change: fn()
    }
};

export default metadata;

export const defaultStory: StoryObj<SearchInputArgs> = {
    name: 'default'
};
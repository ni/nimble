import { html, ref } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnDateTextTag } from '@ni/nimble-components/dist/esm/table-column/date-text';
import {
    Direction,
    themeProviderTag
} from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import {
    sharedTableArgTypes,
    type SharedTableArgs,
    sharedTableArgs
} from '../table-column/base/table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

const simpleData = [
    {
        date: new Date(1984, 4, 12, 14, 34, 19, 377).valueOf()
    },
    {
        date: new Date(1984, 2, 19, 7, 6, 48, 584).valueOf()
    },
    {
        date: new Date(2013, 3, 1, 20, 4, 37, 975).valueOf()
    },
    {
        date: new Date(2022, 0, 12, 20, 4, 37, 975).valueOf()
    }
] as const;

const metadata: Meta = {
    title: 'Tokens/Theme Provider',
    parameters: {
        docs: {
            description: {
                component: ''
            }
        }
    },
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        }
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

const langDescription = `Defines the language of the element. See [external documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) for details.

Applications should set \`lang\` on the root \`html\` element of the page to reflect the language of the content. If necessary, users may override the language for a subtree by inserting a \`nimble-theme-provider\` element and setting its \`lang\` attribute. Nimble elements will not honor a \`lang\` value set on any other type of ancestor element.`;

interface ThemeProviderArgs extends SharedTableArgs {
    theme: keyof typeof Theme;
    lang: string;
    direction: keyof typeof Direction;
}

export const themeProvider: StoryObj<ThemeProviderArgs> = {
    render: createUserSelectedThemeStory(html<ThemeProviderArgs>`
        <${themeProviderTag}
            theme="${x => Theme[x.theme]}"
            lang="${x => x.lang}"
            direction="${x => Direction[x.direction]}"
        >
            <${tableTag}
                ${ref('tableRef')}
                data-unused="${x => x.updateData(x)}"
                style="height: 200px"
            >
                <${tableColumnDateTextTag}
                    field-name="date"
                >
                Date
                </${tableColumnDateTextTag}>
            </${tableTag}>
        </${themeProviderTag}>
    `),
    argTypes: {
        theme: {
            description:
                'The display theme to use. One of `"light"`, `"dark"`, or `"color"`. The `Theme` type exposes these values.',
            defaultValue: {
                summary: '"light"'
            },
            options: Object.keys(Theme),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        lang: {
            description: langDescription,
            defaultValue: {
                summary:
                    '`lang` of the document element if set, otherwise "en-US".'
            },
            options: ['en-US', 'fr-FR', 'de-DE'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        direction: {
            description:
                'The text direction of the element. Either `"ltr"` or `"rtl"`. The `Direction` type exposes these values. Note: Right-to-left support in Nimble is untested. If you need this capability, please file an issue.',
            defaultValue: {
                summary: '"ltr"'
            },
            options: Object.keys(Direction),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        theme: Theme.light,
        lang: 'en-US',
        direction: Direction.ltr
    }
};

export const scrollbarColorScheme: StoryObj = {
    render: () => html`
        <div style="display: flex; gap: 16px; padding: 16px;">
            ${Object.values(Theme).map(
                themeValue => html`
                    <${themeProviderTag} theme="${themeValue}" style="flex: 1;">
                        <div style="
                            display: flex;
                            flex-direction: column;
                            height: 300px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            padding: 12px;
                        ">
                            <div style="font-weight: bold; margin-bottom: 8px;">Theme: ${themeValue}</div>
                            <div style="
                                flex: 1;
                                overflow-y: auto;
                                padding: 8px;
                                font-size: 14px;
                                line-height: 1.6;
                            ">
                                Scrollable content to demonstrate color-scheme-driven scrollbar styling.
                                <br/><br/>
                                The scrollbar appearance (color and style) is determined by the CSS
                                color-scheme property set on the theme provider.
                                <br/><br/>
                                Light theme uses light scrollbars, dark theme uses dark scrollbars.
                                <br/><br/>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                nisi ut aliquip ex ea commodo consequat.
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.
                            </div>
                        </div>
                    </${themeProviderTag}>
                `
            )}
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story:
                    'This story displays scrollable content in each theme to demonstrate how the color-scheme CSS property affects native scrollbar rendering. Light theme shows light scrollbars, dark theme shows dark scrollbars.'
            }
        }
    }
};

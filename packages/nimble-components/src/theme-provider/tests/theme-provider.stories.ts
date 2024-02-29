import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { tableTag } from '../../table';
import { tableColumnDateTextTag } from '../../table-column/date-text';
import {
    sharedTableArgTypes,
    type SharedTableArgs,
    sharedTableArgs
} from '../../table-column/base/tests/table-column-stories-utils';
import { Theme } from '../types';
import { Direction, themeProviderTag } from '..';

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
            control: { type: 'radio' }
        },
        lang: {
            description: langDescription,
            defaultValue: {
                summary:
                    '`lang` of the document element if set, otherwise "en-US".'
            },
            options: ['en-US', 'fr-FR', 'de-DE'],
            control: { type: 'radio' }
        },
        direction: {
            description:
                'The text direction of the element. Either `"ltr"` or `"rtl"`. The `Direction` type exposes these values. Note: Right-to-left support in Nimble is untested. If you need this capability, please file an issue.',
            defaultValue: {
                summary: '"ltr"'
            },
            options: Object.keys(Direction),
            control: { type: 'radio' }
        }
    },
    args: {
        theme: Theme.light,
        lang: 'en-US',
        direction: Direction.ltr
    }
};

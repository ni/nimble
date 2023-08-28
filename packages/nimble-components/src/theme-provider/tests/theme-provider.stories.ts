import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Internal/Theme Provider',
    parameters: {
        docs: {
            description: {
                component: ''
            }
        }
    }
};

export default metadata;

const langDescription = `Defines the language of the element. See [external documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) for details.

Users should set \`lang\` on the root \`html\` element of the page to reflect the language of the content. If necessary, users may override the language for a subtree by inserting a \`nimble-theme-provider\` element and setting its \`lang\` attribute. Nimble elements will not honor a \`lang\` value set on any other type of ancestor element.`;

export const themeProvider: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        theme: {
            description:
                'The display theme to use. One of `Theme.light`, `Theme.dark`, or `Theme.color`.',
            defaultValue: {
                summary: 'Theme.light'
            },
            control: { type: 'none' }
        },
        lang: {
            description: langDescription,
            defaultValue: {
                summary:
                    '`lang` of the document element if set, otherwise "en-US".'
            }
        },
        direction: {
            description:
                'The text direction of the element. Either `Direction.ltr` or `Direction.rtl`.',
            defaultValue: {
                summary: 'Direction.ltr'
            }
        }
    },
    args: {}
};

import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { listboxTag } from '..';
import { listOptionTag } from '../../list-option';

const listboxDescription = 'Per [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) - A listbox widget presents a list of options and allows a user to select one or more of them. A listbox that allows a single option to be chosen is a single-select listbox; one that allows multiple options to be selected is a multi-select listbox.';

const metadata: Meta = {
    title: 'Tests/Listbox',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: listboxDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    <${listboxTag}>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2">Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="4">Option 4</${listOptionTag}>
        <${listOptionTag} value="5">Option 5</${listOptionTag}>
    </${listboxTag}>
    `)
};

export default metadata;

export const listbox: StoryObj = {};

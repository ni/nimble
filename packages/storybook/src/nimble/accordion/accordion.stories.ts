import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html, repeat, when } from '@ni/fast-element';
import { accordionTag } from '@ni/nimble-components/dist/esm/accordion';
import { accordionItemTag } from '@ni/nimble-components/dist/esm/accordion/item';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import {
    createUserSelectedThemeStory,
    apiCategory
} from '../../utilities/storybook';

interface AccordionArgs {
    expandMode: 'single' | 'multiple';
    appearance?: 'ghost' | 'outline' | 'block';
    items: ItemArgs[];
}

interface ItemArgs {
    heading?: string;
    disabled?: boolean;
    error?: boolean;
    expanded?: boolean;
}

const metadata: Meta<AccordionArgs> = {
    title: 'Components/Accordion',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['toggle-request']
        }
    }
};

export default metadata;

const renderItemContent = (x: ItemArgs): unknown => (x.error
    ? html`<nimble-text-field
              error-visible
              value="invalid"
          ></nimble-text-field>`
    : html`<div>Section content</div>`);

export const _standardAccordion: StoryObj<AccordionArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${accordionTag}
            expand-mode="${x => x.expandMode}"
            appearance="${x => x.appearance ?? 'ghost'}"
            style="max-width: 560px; display:block;"
        >
            ${repeat(x => x.items, html<ItemArgs, AccordionArgs>`
                <${accordionItemTag}
                    heading="${x => x.heading ?? ''}"
                    ?disabled="${x => !!x.disabled}"
                    ?expanded="${x => !!x.expanded}"
                >
                    ${when(x => !!x.error, html`
                        <${iconExclamationMarkTag} slot="end"></${iconExclamationMarkTag}>
                    `)}
                    ${x => renderItemContent(x)}
                </${accordionItemTag}>
            `)}
        </${accordionTag}>
`),
    // eslint-disable-next-line storybook/no-redundant-story-name
    name: 'Standard Accordion',
    argTypes: {
        items: {
            name: 'default',
            description: `The \`${accordionItemTag}\` elements that populate this accordion.`,
            table: { category: apiCategory.slots }
        },
        expandMode: {
            options: ['multiple', 'single'],
            control: { type: 'radio' },
            description: 'Controls whether one or multiple panels can be open.',
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: ['ghost', 'outline', 'block'],
            control: { type: 'radio' },
            description:
                'Visual style of the accordion container: ghost (no border), outline (border), or block (filled).',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        expandMode: 'multiple',
        appearance: 'ghost',
        items: [
            { heading: 'Group label' },
            { heading: 'Group label', expanded: true },
            { heading: 'Group label', error: true },
            { heading: 'Group label', disabled: true }
        ]
    }
};

export const accordionItem: StoryObj<ItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <${accordionTag} style="max-width: 560px; display:block;">
            <${accordionItemTag}
                heading="${x => x.heading ?? ''}"
                ?disabled="${x => !!x.disabled}"
                ?expanded="${x => !!x.expanded}"
            >
                ${x => renderItemContent(x)}
            </${accordionItemTag}>
        </${accordionTag}>
    `),
    argTypes: {
        heading: {
            description:
                'Heading text for the item when not using a slotted heading.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description:
                'Disables the accordion item and prevents user interaction.',
            table: { category: apiCategory.attributes }
        },
        expanded: {
            description: 'Sets the item to be expanded by default.',
            table: { category: apiCategory.attributes }
        },
        error: {
            description:
                'Shows an example of the item reflecting an error state from its content.',
            control: 'boolean',
            table: { category: apiCategory.nonAttributeProperties }
        }
    },
    args: {
        heading: 'Section heading',
        expanded: false,
        disabled: false,
        error: false
    }
};

import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvAccordionItemTag } from '@ni/ok-components/dist/esm/fv-accordion-item';
import { FvAccordionItemAppearance } from '@ni/ok-components/dist/esm/fv-accordion-item/types';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

interface AccordionItemArgs {
    header: string;
    expanded: boolean;
    appearance: FvAccordionItemAppearance;
}

const accordionContentStyle = `
    font: var(${bodyFont.cssCustomProperty});
    color: var(${bodyFontColor.cssCustomProperty});
`;

const accordionGroupStyle = `
    width: 400px;
    ${accordionContentStyle}
`;

const metadata: Meta<AccordionItemArgs> = {
    title: 'Ok/FV Accordion Item',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <div style="${accordionContentStyle}">
            <${fvAccordionItemTag}
                header="${x => x.header}"
                ?expanded="${x => x.expanded}"
                appearance="${x => x.appearance}"
            >
                <${textFieldTag} placeholder="Enter name" appearance="underline"></${textFieldTag}>
                <${textFieldTag} placeholder="Enter category" appearance="underline"></${textFieldTag}>
            </${fvAccordionItemTag}>
        </div>
    `),
    argTypes: {
        header: {
            description:
                'The text displayed in the accordion item header.',
            table: { category: apiCategory.attributes }
        },
        expanded: {
            description:
                'Controls whether the accordion item content is visible.',
            table: { category: apiCategory.attributes }
        },
        appearance: {
            description:
                'The visual appearance of the accordion item: ghost, outline, or block.',
            options: Object.values(FvAccordionItemAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        header: 'Expanded Accordion',
        expanded: true,
        appearance: FvAccordionItemAppearance.ghost
    }
};

export default metadata;

export const fvAccordionItem: StoryObj<AccordionItemArgs> = {
    name: 'FV Accordion Item',
    args: {
        header: 'Expanded Accordion',
        expanded: true,
        appearance: FvAccordionItemAppearance.ghost
    }
};

export const groupedItems: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${fvAccordionItemTag} header="Shipping" appearance="${x => x.appearance}" expanded>
                <${textFieldTag} appearance="underline">Address</${textFieldTag}>
                <${textFieldTag} appearance="underline">City</${textFieldTag}>
                <${selectTag}>
                    State
                    <${listOptionTag} value="CA">California</${listOptionTag}>
                    <${listOptionTag} value="NY">New York</${listOptionTag}>
                    <${listOptionTag} value="TX">Texas</${listOptionTag}>
                </${selectTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Payment" appearance="${x => x.appearance}">
                <${textFieldTag} appearance="underline">Card number</${textFieldTag}>
                <${numberFieldTag} appearance="underline">CVV</${numberFieldTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Delivery" appearance="${x => x.appearance}">
                <${checkboxTag}>Express shipping</${checkboxTag}>
                <${checkboxTag}>Gift wrapping</${checkboxTag}>
            </${fvAccordionItemTag}>
        </div>
    `),
    args: {
        appearance: FvAccordionItemAppearance.outline
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

export const nestedItems: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${fvAccordionItemTag} header="Versioning" appearance="${x => x.appearance}" expanded>
                <${fvAccordionItemTag} header="GET / API information" appearance="ghost" expanded>
                    <p style="margin: 0;">Returns information about API versions and available operations.</p>
                </${fvAccordionItemTag}>
                <${fvAccordionItemTag} header="GET / v2 API version information" appearance="ghost">
                    <p style="margin: 0;">Returns details for the v2 API endpoint.</p>
                </${fvAccordionItemTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Subscriptions" appearance="${x => x.appearance}">
                <${fvAccordionItemTag} header="List subscriptions" appearance="ghost">
                    <p style="margin: 0;">Returns all active subscriptions.</p>
                </${fvAccordionItemTag}>
                <${fvAccordionItemTag} header="Create subscription" appearance="ghost">
                    <${textFieldTag} appearance="underline">Name</${textFieldTag}>
                </${fvAccordionItemTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Tags" appearance="${x => x.appearance}">
                <${checkboxTag}>Include archived</${checkboxTag}>
            </${fvAccordionItemTag}>
        </div>
    `),
    args: {
        appearance: FvAccordionItemAppearance.outline
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

export const mixedContent: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${fvAccordionItemTag} header="Size" appearance="${x => x.appearance}" expanded>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    <${checkboxTag}>XS</${checkboxTag}>
                    <${checkboxTag}>S</${checkboxTag}>
                    <${checkboxTag}>M</${checkboxTag}>
                    <${checkboxTag}>L</${checkboxTag}>
                    <${checkboxTag}>XL</${checkboxTag}>
                    <${checkboxTag}>XXL</${checkboxTag}>
                </div>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Color" appearance="${x => x.appearance}">
                <${selectTag}>
                    Color
                    <${listOptionTag} value="red">Red</${listOptionTag}>
                    <${listOptionTag} value="blue">Blue</${listOptionTag}>
                    <${listOptionTag} value="green">Green</${listOptionTag}>
                </${selectTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Price" appearance="${x => x.appearance}">
                <${numberFieldTag} appearance="underline">Min</${numberFieldTag}>
                <${numberFieldTag} appearance="underline">Max</${numberFieldTag}>
            </${fvAccordionItemTag}>
        </div>
    `),
    args: {
        appearance: FvAccordionItemAppearance.outline
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

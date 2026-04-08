import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { accordionItemTag } from '@ni/ok-components/dist/esm/accordion-item';
import { AccordionItemAppearance } from '@ni/ok-components/dist/esm/accordion-item/types';
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
    appearance: AccordionItemAppearance;
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
    title: 'Ok/Accordion Item',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <div style="${accordionContentStyle}">
            <${accordionItemTag}
                header="${x => x.header}"
                ?expanded="${x => x.expanded}"
                appearance="${x => x.appearance}"
            >
                <${textFieldTag} placeholder="Enter name" appearance="underline"></${textFieldTag}>
                <${textFieldTag} placeholder="Enter category" appearance="underline"></${textFieldTag}>
            </${accordionItemTag}>
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
            options: Object.values(AccordionItemAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        header: 'Expanded Accordion',
        expanded: true,
        appearance: AccordionItemAppearance.ghost
    }
};

export default metadata;

export const ghost: StoryObj<AccordionItemArgs> = {
    args: {
        header: 'Ghost Accordion',
        expanded: true,
        appearance: AccordionItemAppearance.ghost
    }
};

export const outline: StoryObj<AccordionItemArgs> = {
    args: {
        header: 'Outline Accordion',
        expanded: true,
        appearance: AccordionItemAppearance.outline
    }
};

export const block: StoryObj<AccordionItemArgs> = {
    args: {
        header: 'Block Accordion',
        expanded: true,
        appearance: AccordionItemAppearance.block
    }
};

export const outlineGroup: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${accordionItemTag} header="Shipping" appearance="${x => x.appearance}" expanded>
                <${textFieldTag} appearance="underline">Address</${textFieldTag}>
                <${textFieldTag} appearance="underline">City</${textFieldTag}>
                <${selectTag}>
                    State
                    <${listOptionTag} value="CA">California</${listOptionTag}>
                    <${listOptionTag} value="NY">New York</${listOptionTag}>
                    <${listOptionTag} value="TX">Texas</${listOptionTag}>
                </${selectTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Payment" appearance="${x => x.appearance}">
                <${textFieldTag} appearance="underline">Card number</${textFieldTag}>
                <${numberFieldTag} appearance="underline">CVV</${numberFieldTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Delivery" appearance="${x => x.appearance}">
                <${checkboxTag}>Express shipping</${checkboxTag}>
                <${checkboxTag}>Gift wrapping</${checkboxTag}>
            </${accordionItemTag}>
        </div>
    `),
    args: {
        appearance: AccordionItemAppearance.outline
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

export const ghostGroup: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${accordionItemTag} header="Asset details" appearance="${x => x.appearance}" expanded>
                <p style="margin: 0px;">Serial number: PXI-12345</p>
                <p style="margin: 0px;">Location: Lab 2</p>
            </${accordionItemTag}>
            <${accordionItemTag} header="Ownership" appearance="${x => x.appearance}">
                <p style="margin: 0px;">Assigned to calibration operations.</p>
            </${accordionItemTag}>
            <${accordionItemTag} header="Notes" appearance="${x => x.appearance}">
                <p style="margin: 0px;">Ghost appearance keeps related sections visually lightweight.</p>
            </${accordionItemTag}>
        </div>
    `),
    args: {
        appearance: AccordionItemAppearance.ghost
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

export const blockGroup: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${accordionItemTag} header="General" appearance="${x => x.appearance}" expanded>
                <${textFieldTag} appearance="underline">Project name</${textFieldTag}>
                <${textFieldTag} appearance="underline">Description</${textFieldTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Configuration" appearance="${x => x.appearance}">
                <${checkboxTag}>Enable notifications</${checkboxTag}>
                <${checkboxTag}>Auto-save</${checkboxTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Advanced" appearance="${x => x.appearance}">
                <${numberFieldTag} appearance="underline">Timeout (ms)</${numberFieldTag}>
                <${numberFieldTag} appearance="underline">Max retries</${numberFieldTag}>
            </${accordionItemTag}>
        </div>
    `),
    args: {
        appearance: AccordionItemAppearance.block
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

export const nestedAccordion: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${accordionItemTag} header="Versioning" appearance="${x => x.appearance}" expanded>
                <${accordionItemTag} header="GET / API information" appearance="ghost" expanded>
                    <p style="margin: 0;">Returns information about API versions and available operations.</p>
                </${accordionItemTag}>
                <${accordionItemTag} header="GET / v2 API version information" appearance="ghost">
                    <p style="margin: 0;">Returns details for the v2 API endpoint.</p>
                </${accordionItemTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Subscriptions" appearance="${x => x.appearance}">
                <${accordionItemTag} header="List subscriptions" appearance="ghost">
                    <p style="margin: 0;">Returns all active subscriptions.</p>
                </${accordionItemTag}>
                <${accordionItemTag} header="Create subscription" appearance="ghost">
                    <${textFieldTag} appearance="underline">Name</${textFieldTag}>
                </${accordionItemTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Tags" appearance="${x => x.appearance}">
                <${checkboxTag}>Include archived</${checkboxTag}>
            </${accordionItemTag}>
        </div>
    `),
    args: {
        appearance: AccordionItemAppearance.outline
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

export const mixedContent: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${accordionItemTag} header="Size" appearance="${x => x.appearance}" expanded>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    <${checkboxTag}>XS</${checkboxTag}>
                    <${checkboxTag}>S</${checkboxTag}>
                    <${checkboxTag}>M</${checkboxTag}>
                    <${checkboxTag}>L</${checkboxTag}>
                    <${checkboxTag}>XL</${checkboxTag}>
                    <${checkboxTag}>XXL</${checkboxTag}>
                </div>
            </${accordionItemTag}>
            <${accordionItemTag} header="Color" appearance="${x => x.appearance}">
                <${selectTag}>
                    Color
                    <${listOptionTag} value="red">Red</${listOptionTag}>
                    <${listOptionTag} value="blue">Blue</${listOptionTag}>
                    <${listOptionTag} value="green">Green</${listOptionTag}>
                </${selectTag}>
            </${accordionItemTag}>
            <${accordionItemTag} header="Price" appearance="${x => x.appearance}">
                <${numberFieldTag} appearance="underline">Min</${numberFieldTag}>
                <${numberFieldTag} appearance="underline">Max</${numberFieldTag}>
            </${accordionItemTag}>
        </div>
    `),
    args: {
        appearance: AccordionItemAppearance.outline
    },
    argTypes: {
        header: { control: false, table: { disable: true } },
        expanded: { control: false, table: { disable: true } }
    }
};

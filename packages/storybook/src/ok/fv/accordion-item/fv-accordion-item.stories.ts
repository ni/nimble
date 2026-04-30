import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvAccordionItemTag } from '@ni/ok-components/dist/esm/fv/accordion-item';
import { FvAccordionItemAppearance } from '@ni/ok-components/dist/esm/fv/accordion-item/types';
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
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

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
    title: 'Ok/Fv Accordion Item',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'accordion',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
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
        header: 'Section header',
        expanded: true,
        appearance: FvAccordionItemAppearance.ghost
    }
};

export default metadata;

export const fvAccordionItem: StoryObj<AccordionItemArgs> = {
    args: {
        header: 'Section header',
        expanded: true,
        appearance: FvAccordionItemAppearance.ghost
    }
};

export const fvAccordion: StoryObj<AccordionItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="${accordionGroupStyle}">
            <${fvAccordionItemTag} header="Profile" appearance="${x => x.appearance}" expanded>
                <${textFieldTag} appearance="underline" placeholder="Enter name"></${textFieldTag}>
                <${textFieldTag} appearance="underline" placeholder="Enter role"></${textFieldTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Preferences" appearance="${x => x.appearance}">
                <${checkboxTag}>Enable notifications</${checkboxTag}>
                <${checkboxTag}>Show archived items</${checkboxTag}>
            </${fvAccordionItemTag}>
            <${fvAccordionItemTag} header="Limits" appearance="${x => x.appearance}">
                <${numberFieldTag} appearance="underline">Minimum</${numberFieldTag}>
                <${numberFieldTag} appearance="underline">Maximum</${numberFieldTag}>
                <${selectTag}>
                    Mode
                    <${listOptionTag} value="standard">Standard</${listOptionTag}>
                    <${listOptionTag} value="compact">Compact</${listOptionTag}>
                    <${listOptionTag} value="detailed">Detailed</${listOptionTag}>
                </${selectTag}>
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

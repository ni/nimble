import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { html, repeat, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory, incubatingWarning } from '../../utilities/tests/storybook';
import { AccordionAppearance } from '../../accordion-item/types';
import { accordionTag } from '..';
import { accordionItemTag } from '../../accordion-item';
import { iconExclamationMarkTag } from '../../icons/exclamation-mark';
import { checkboxTag } from '../../checkbox';

interface AccordionArgs {
    options: ItemArgs[];
}

interface ItemArgs {
    heading: string;
    label: string;
    errorVisible: boolean;
    appearance: keyof typeof AccordionAppearance;
}

const overviewText = 'hello';

const metadata: Meta<AccordionArgs> = {
    title: 'Incubating/Accordion',
    decorators: [withActions],
    tags: ['autodocs'],

    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {
            handles: ['change']
        }
    },
};

export default metadata;

export const _standardAccordion: StoryObj<AccordionArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'accordion',
        statusLink: 'https://github.com/ni/nimble/issues/533'
    })}
        <${accordionTag}
        >
            ${repeat(x => x.options, html<ItemArgs, AccordionArgs>`
                <${accordionItemTag}
                    ?error-visible="${x => x.errorVisible}",
                    appearance="${x => AccordionAppearance[x.appearance]}"
                >
                    <div slot="heading">
                        <span>${x => x.heading}</span>
                        ${when(x => x.errorVisible, html`
                            <${iconExclamationMarkTag} slot="start"></${iconExclamationMarkTag}>
                        `)}
                    </div>
                    <div>
                        <span>${x => x.label}</span>
                    </div>
                </${accordionItemTag}
            `)}
        </${accordionTag}>
    `),
    // eslint-disable-next-line storybook/no-redundant-story-name
    name: 'Standard Accordion',
    argTypes: {
        options: {
            description: ''
        },
    },
    args: {
        options: [
            {
                heading: 'Accordion 1',
                label: 'Accordion 1 Content',
                errorVisible: false,
                appearance: AccordionAppearance.outline,
            },
            {
                heading: 'Accordion 2',
                label: 'Accordion 2 Content',
                errorVisible: false,
                appearance: AccordionAppearance.outline,
            },
            {
                heading: 'Accordion 3',
                label: 'Accordion 3 Content',
                errorVisible: false,
                appearance: AccordionAppearance.outline,
            }
        ],
    }
};

export const accordionItem: StoryObj<ItemArgs> = {
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'accordion',
        statusLink: 'https://github.com/ni/nimble/issues/533'
    })}
        <${accordionTag}>
            <${accordionItemTag}
                ?error-visible="${x => x.errorVisible}"
                appearance="${x => AccordionAppearance[x.appearance]}"
            >
                <div slot="heading">
                    ${x => x.heading}
                    ${when(x => x.errorVisible, html`
                        <${iconExclamationMarkTag} slot="start"></${iconExclamationMarkTag}>
                    `)}
                </div>
                <div>
                    ${x => x.label}
                    <${checkboxTag}>Option Label</${checkboxTag}>
                    <${checkboxTag}>Option Label</${checkboxTag}>
                <div>
            </${accordionItemTag}
        </${accordionTag}>
    `),
    argTypes: {
        heading: {
            description:
                '(Optional) The URL that this breadcrumb item/ link points to. Generally, the last breadcrumb item '
                + 'representing the current page has no `href` set.'
        },
        label: {
            description:
                '(Optional) Where to display the linked URL (destination browsing context): `_self`, `_blank`, etc.',
        },
        errorVisible: {
            name: 'hello',
            description:
                'description.'
        },
        appearance: {
            options: Object.keys(AccordionAppearance),
            control: { type: 'radio' },
            description: 'This attribute affects the appearance of the accordion.'
        },
    },
    args: {
        heading: 'Accordion 1',
        label: 'Accordion 1 content',
        errorVisible: false,
        appearance: 'block',
    }
};
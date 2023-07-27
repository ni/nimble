import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { html, repeat } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { AccordionAppearance } from '../types';
import { accordionTag } from '..';
import { accordionItemTag } from '../../accordion-item';
import { iconExclamationMarkTag } from '../../icons/exclamation-mark';

interface AccordionArgs {
    options: ItemArgs[];
    appearance: keyof typeof AccordionAppearance;
}

interface ItemArgs {
    heading: string;
    label: string;
    errorVisible: boolean;
}

const overviewText = 'hello';

const metadata: Meta<AccordionArgs> = {
    title: 'Components/Accordion',
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
    }
};

export default metadata;

export const _standardAccordion: StoryObj<AccordionArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${accordionTag}
            appearance="${x => AccordionAppearance[x.appearance]}"
        >
            ${repeat(x => x.options, html<ItemArgs, AccordionArgs>`
                <${accordionItemTag}
                    ?error-visible="${x => x.errorVisible}",
                >
                    <div slot="heading">
                        <span>${x => x.heading}</span>
                    </div>
                    <${iconExclamationMarkTag} slot="end"></${iconExclamationMarkTag}>
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
        appearance: {
            options: Object.keys(AccordionAppearance),
            control: { type: 'radio' },
            description: 'This attribute affects the appearance of the accordion.'
        },
    },
    args: {
        options: [
            {
                heading: 'Accordion 1',
                label: 'Accordion 1 Content',
                errorVisible: false
            },
            {
                heading: 'Accordion 2',
                label: 'Accordion 2 Content',
                errorVisible: false
            },
            {
                heading: 'Accordion 3',
                label: 'Accordion 3 Content',
                errorVisible: false
            }
        ],
        appearance: AccordionAppearance.outline,
    }
};

export const accordionItem: StoryObj<ItemArgs> = {
    render: createUserSelectedThemeStory(html`
        <${accordionTag}>
            <${accordionItemTag}
                ?error-visible="${x => x.errorVisible}"
            >
                <span slot="heading">${x => x.heading}</span>
                    ${x => x.label}
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
        }
    },
    args: {
        heading: 'Accordion 1',
        label: 'Accordion 1 content',
        errorVisible: false
    }
};
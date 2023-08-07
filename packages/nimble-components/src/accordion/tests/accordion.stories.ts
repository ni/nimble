import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { html, repeat } from '@microsoft/fast-element';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { AccordionAppearance } from '../types';
import { accordionTag } from '..';
import { accordionItemTag } from '../../accordion-item';
import { checkboxTag } from '../../checkbox';

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
    }
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
            appearance="${x => AccordionAppearance[x.appearance]}"
        >
            ${repeat(x => x.options, html<ItemArgs, AccordionArgs>`
                <${accordionItemTag}
                    ?error-visible="${x => x.errorVisible}",
                >
                    <div slot="heading">
                        <span>${x => x.heading}</span>
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
        appearance: {
            options: Object.keys(AccordionAppearance),
            control: { type: 'radio' },
            description:
                'This attribute affects the appearance of the accordion.'
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
        appearance: 'outline',
    }
};

export const accordionItem: StoryObj<ItemArgs> = {
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'accordion',
        statusLink: 'https://github.com/ni/nimble/issues/533'
    })}
        <${accordionTag}
            appearance="block"
        >
            <${accordionItemTag}
                ?error-visible="${x => x.errorVisible}"
            >
                <div slot="heading">
                    ${x => x.heading}
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
                '(Optional) Where to display the linked URL (destination browsing context): `_self`, `_blank`, etc.'
        },
        errorVisible: {
            name: 'errorVisible',
            description: ''
        }
    },
    args: {
        heading: 'Accordion 1',
        label: 'Accordion 1 content',
        errorVisible: false
    }
};

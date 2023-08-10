import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { html, repeat, ref } from '@microsoft/fast-element';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { AccordionAppearance } from '../types';
import { accordionTag } from '..';
import { accordionItemTag } from '../../accordion-item';
import { checkboxTag } from '../../checkbox';
import { Table, tableTag } from '../../table';
import { tableColumnTextTag } from '../../table-column/text';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';
import { iconUserTag } from '../../icons/user';

interface AccordionArgs {
    options: ItemArgs[];
    appearance: keyof typeof AccordionAppearance;
}

interface ItemArgs {
    heading: string;
    label: string;
    errorVisible: boolean;
    disabled: boolean;
}

interface ItemAndTableArgs {
    heading: string;
    label: string;
    errorVisible: boolean;
    disabled: boolean;
    tableRef: Table;
    updateData: (args: ItemAndTableArgs) => void;
}

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: 'Hi diddly-ho neighbor!'
    }
] as const;

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
                    ?disabled="${x => x.disabled}"
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
        }
    },
    args: {
        options: [
            {
                heading: 'Accordion 1',
                label: 'Accordion 1 Content',
                errorVisible: false,
                disabled: false
            },
            {
                heading: 'Accordion 2',
                label: 'Accordion 2 Content',
                errorVisible: false,
                disabled: false
            },
            {
                heading: 'Accordion 3',
                label: 'Accordion 3 Content',
                errorVisible: false,
                disabled: false
            }
        ],
        appearance: 'outline'
    }
};

export const accordionItem: StoryObj<ItemArgs> = {
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'accordion',
        statusLink: 'https://github.com/ni/nimble/issues/533'
    })}
        <style>
            ${checkboxTag} {
                width: fit-content;
            }
        </style>
        <${accordionTag}
            appearance="block"
        >
            <${accordionItemTag}
                ?error-visible="${x => x.errorVisible}"
                ?disabled="${x => x.disabled}"
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
        heading: {},
        label: {},
        errorVisible: {
            name: 'errorVisible',
            description: ''
        }
    },
    args: {
        heading: 'Accordion 1',
        label: 'Accordion 1 content',
        errorVisible: false,
        disabled: false
    }
};

/**
 * An example based on this GitHub comment from Jesse:
 * [https://github.com/ni/nimble/issues/533#issuecomment-1265661942]
 */
export const highLevelAccordionItem: StoryObj<ItemAndTableArgs> = {
    render: createUserSelectedThemeStory(html<ItemAndTableArgs>`
    ${incubatingWarning({
        componentName: 'accordion',
        statusLink: 'https://github.com/ni/nimble/issues/533'
    })}
        <style>
            ${tableTag} {
                height: fit-content;
            }
        </style>
        <${accordionTag}
            appearance="block"
        >
            <${accordionItemTag}
                ?error-visible="${x => x.errorVisible}"
                ?disabled="${x => x.disabled}"
            >
                <div slot="heading">
                    ${x => x.heading}
                </div>
                <div>
                        <${tableTag}
                            ${ref('tableRef')}
                            data-unused="${x => x.updateData(x)}"
                            id-field-name="firstName" 
                            data-unused="${simpleData}">
                            <${tableColumnTextTag}
                                column-id="first-name-column"
                                field-name="firstName"
                                action-menu-slot="name-menu"
                                action-menu-label="Configure name"
                            >
                                <${iconUserTag} title="First Name"></${iconUserTag}>
                            </${tableColumnTextTag}>
                            <${tableColumnTextTag}
                                column-id="last-name-column"
                                field-name="lastName"
                                action-menu-slot="name-menu"
                                action-menu-label="Configure name"
                            >
                                Last Name
                            </${tableColumnTextTag}>
                            <${tableColumnTextTag}
                                column-id="favorite-color-column"
                                field-name="favoriteColor"
                            >
                                Favorite Color
                            </${tableColumnTextTag}>
                            <${tableColumnTextTag}
                                column-id="quote-column"
                                field-name="quote"
                                action-menu-slot="quote-menu"
                                action-menu-label="Configure quote"
                            >
                                Quote
                            </${tableColumnTextTag}>
                            <${menuTag} slot="name-menu">
                                <${menuItemTag}>Edit name</${menuItemTag}>
                                <${menuItemTag}>Delete person</${menuItemTag}>
                                <${menuItemTag}>Archive person</${menuItemTag}>
                                <${menuItemTag}>Duplicate person</${menuItemTag}>
                            </${menuTag}>
                            <${menuTag} slot="quote-menu">
                                <${menuItemTag}>Edit quote</${menuItemTag}>
                                <${menuItemTag}>Delete quote</${menuItemTag}>
                                <${menuItemTag}>Do something else with the quote</${menuItemTag}>
                            </${menuTag}>
                        </${tableTag}>
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
        },
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        heading: 'Accordion 1',
        label: 'Accordion 1 content',
        errorVisible: false,
        disabled: false,
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                await x.tableRef.setData(simpleData);
            })();
        }
    }
};

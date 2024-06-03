import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { bodyFont } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { cardButtonTag } from '../../../../nimble-components/src/card-button';
import { apiCategory, createUserSelectedThemeStory, disabledDescription } from '../../utilities/storybook';

interface CardButtonArgs {
    disabled: boolean;
    selected: boolean;
    content: string;
    click: undefined;
}

const metadata: Meta<CardButtonArgs> = {
    title: 'Components/Card Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['click']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style>
            .wrapper {
                margin: 32px 40px;
                display: flex;
                font: var(${bodyFont.cssCustomProperty});
                align-items: center;
            }

            .count {
                font-size: 32px;
                line-height: 40px;
                padding-right: 10px;
            }

            .label {
                text-transform: uppercase;
                font-weight: 600;
            }
        </style>
        <${cardButtonTag}
            ?disabled=${x => x.disabled}
            ?selected=${x => x.selected}
        >
            <div class="wrapper">
                <div class="count">15</div>
                <div class="label">systems</div>
            </div>
        </${cardButtonTag}>
    `),
    args: {
        disabled: false,
        selected: false
    },
    argTypes: {
        disabled: {
            description: disabledDescription({ componentName: 'card button' }),
            table: { category: apiCategory.attributes }
        },
        selected: {
            description: 'Styles the card button to indicate it is selected.',
            table: { category: apiCategory.attributes }
        },
        content: {
            name: 'default',
            description: 'The card button allows arbitrary HTML child content in its default slot.',
            table: { category: apiCategory.slots },
            control: false
        },
        click: {
            description:
                'Event emitted when the card button is activated by either keyboard or mouse.',
            table: { category: apiCategory.events },
            control: false
        }
    }
};

export default metadata;

export const cardButton: StoryObj<CardButtonArgs> = {};

import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { bodyFont } from '../../theme-provider/design-tokens';
import { cardButtonTag } from '..';

interface CardButtonArgs {
    disabled: boolean;
    selected: boolean;
}

const metadata: Meta<CardButtonArgs> = {
    title: 'Components/Card Button',
    decorators: [withActions],
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
    }
};

export default metadata;

export const cardButton: StoryObj<CardButtonArgs> = {};

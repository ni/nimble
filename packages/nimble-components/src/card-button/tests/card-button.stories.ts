import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { bodyFont, groupHeaderFont, sectionBackgroundColor, titleFont } from '../../theme-provider/design-tokens';
import type { CardButton } from '..';

interface CardButtonArgs {
    disabled: boolean;
    selected: boolean;
}

const overviewText = `TODO`;

const metadata: Meta<CardButtonArgs> = {
    title: 'Card Button',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20/specs/'
        },
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style>
            .section {
                width: 100%;
                height: 100%;
                padding: 32px;
                background: var(${sectionBackgroundColor.cssCustomProperty});
            }

            .wrapper {
                padding: 32px 40px;
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
        <div class="section">
            <nimble-card-button
                ?disabled=${x => x.disabled}
                ?selected=${x => x.selected}
            >
                <div class="wrapper">
                    <div class="count">15</div>
                    <div class="label">systems</div>
                </div>
            </nimble-card-button>
        </div>
    `),
    args: {
        disabled: false,
        selected: false
    }
};

export default metadata;

export const cardButtonStory: StoryObj<CardButtonArgs> = {
    name: 'Card Button'
};

export const iconCardButtonStory: StoryObj<CardButtonArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`<style>
        .wrapper {
            padding: 32px 40px;
            display: flex;
            font: var(${titleFont.cssCustomProperty});
            flex-direction: column;
            align-items: center;
        }

        .icon {
            width: 76px;
            height: 76px;
            padding-bottom: 10px;
        }
    </style>
    <nimble-card-button
        ?disabled=${x => x.disabled}
        ?selected=${x => x.selected}
    >
        <div class="wrapper">
            <nimble-icon-webvi-host class="icon"></nimble-icon-webvi-host>
            <span class="label">Open WebVIs</span>
        </div>
    </nimble-card-button>
    `)
};

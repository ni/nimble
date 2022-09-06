import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { bodyFont } from '../../theme-provider/design-tokens';

interface CardButtonArgs {
    disabled: boolean;
    selected: boolean;
}

const overviewText = `The \`nimble-card-button\` is a button that is designed to contain arbitrary content that is specified by a client
application. The \`nimble-card-button\` is intended to be larger and more prominent on a page than the standard \`nimble-button\`.

Note: The styling for the "Color" theme is not complete.`;

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
        <nimble-card-button
            ?disabled=${x => x.disabled}
            ?selected=${x => x.selected}
        >
            <div class="wrapper">
                <div class="count">15</div>
                <div class="label">systems</div>
            </div>
        </nimble-card-button>
    `),
    args: {
        disabled: false,
        selected: false
    }
};

export default metadata;

export const cardButton: StoryObj<CardButtonArgs> = {};

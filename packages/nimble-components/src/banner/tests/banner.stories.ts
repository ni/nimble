import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { BannerActionButtonAppearance, BannerType } from '../types';

interface BannerArgs {
    heading: string;
    text: string;
    type: BannerType;
    actionText: string;
    actionHref: string;
    actionButtonAppearance: BannerActionButtonAppearance;
    preventDismiss: boolean;
}

const overviewText = `The banner is a component used to display a persistent notification to a user.`;

const metadata: Meta<BannerArgs> = {
    title: 'Banner',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e/specs/'
        },
        actions: {}
    }
};

export default metadata;

export const _banner: StoryObj<BannerArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-banner
            heading="${x => x.heading}"
            text="${x => x.text}"
            type="${x => x.type}"
            action-text="${x => x.actionText}"
            action-href="${x => x.actionHref}"
            action-button-appearance="${x => x.actionButtonAppearance}"
            ?prevent-dismiss="${x => x.preventDismiss}"
        >
`),
    // eslint-disable-next-line storybook/no-redundant-story-name
    storyName: 'Banner',
    argTypes: {
        type: {
            options: Object.values(BannerType),
            control: { type: 'radio' }
        },
        actionButtonAppearance: {
            options: Object.values(BannerActionButtonAppearance),
            control: { type: 'radio' }
        }
    },
    args: {
        heading: 'Title text',
        text: 'This is the body text of the banner.',
        type: BannerType.error,
        actionText: 'Perform Action',
        actionHref: '',
        actionButtonAppearance: BannerActionButtonAppearance.ghost,
        preventDismiss: false
    }
};

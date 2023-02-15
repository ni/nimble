import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { BannerSeverity } from '../types';
import { bannerGapSize } from '../../theme-provider/design-tokens';

// eslint-disable-next-line @typescript-eslint/naming-convention
const ActionType = {
    none: 'none',
    buttonGhost: 'button (ghost)',
    buttonOutline: 'button (outline)',
    iconButtonOutline: 'icon button (outline)',
    anchor: 'anchor'
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type ActionType = typeof ActionType[keyof typeof ActionType];

interface BannerArgs {
    open: boolean;
    title: string;
    text: string;
    severity: BannerSeverity;
    action: ActionType;
    preventDismiss: boolean;
    titleHidden: boolean;
    dismissButtonLabel: string;
    toggle: unknown;
}

const overviewText = `The banner is a component used to display a persistent notification to a user.

Banners span the full width of their parent element, and that parent should span the full width of the page/panel.
Banner messages should be limited to approximately three lines of text under normal display size at the intended
location. Multiple banners may be stacked vertically in order of age, with the newest at the top. Stacked banners
should be spaced apart using the \`${bannerGapSize.cssCustomProperty}\` design token.
`;

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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29c405f7-08ea-48b6-973f-546970b9dbab/specs/'
        },
        actions: {
            handles: ['toggle']
        }
    }
};

export default metadata;

export const _banner: StoryObj<BannerArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-banner
            ?open="${x => x.open}"
            severity="${x => x.severity}"
            ?title-hidden="${x => x.titleHidden}"
            ?prevent-dismiss="${x => x.preventDismiss}"
            dismiss-button-label="Close"
        >
            <span slot="title">${x => x.title}</span>
            ${x => x.text}
            ${when(x => x.action === 'button (ghost)', html`
                <nimble-button slot="action" appearance="ghost">Do action</nimble-button>`)}
            ${when(x => x.action === 'button (outline)', html`
                <nimble-button slot="action" appearance="outline">Do action</nimble-button>`)}
            ${when(x => x.action === 'icon button (outline)', html`
                <nimble-button slot="action" appearance="outline" content-hidden>
                    <nimble-icon-key slot="start"></nimble-icon-key>
                    Do action
                </nimble-button>`)}
            ${when(x => x.action === 'anchor', html`
                <nimble-anchor slot="action" href="#">Go to site</nimble-anchor>`)}
        </nimble-banner>
`),
    // eslint-disable-next-line storybook/no-redundant-story-name
    storyName: 'Banner',
    argTypes: {
        open: {
            description: 'Controls whether the banner is visible.'
        },
        title: {
            description:
                'Primary text which is displayed when `title-hidden` is not set. Banners should **always include a title** even when `title-hidden` is set. The title is used to provide an accessible name to assistive technologies regardless of the value of `title-hidden`.<br><br>Provide the title in an `inline` element such as `<span>` that is targeted to the `title` slot.'
        },
        text: {
            description:
                'Secondary text that provides a detailed message. This text should be short enough to fit within three lines when displayed.<br><br>Provide this text as content of the banner element (uses the default slot).'
        },
        severity: {
            options: Object.keys(BannerSeverity),
            control: { type: 'radio' },
            description:
                'Severity of the message presented by the banner. Controls the displayed color and icon. If not set, the banner has a neutral appearance.'
        },
        action: {
            options: Object.values(ActionType),
            control: { type: 'radio' },
            description:
                'The `action` slot provides a place to display a button or anchor that you provide. If you provide a button, it should have either the `"ghost"` or `"outline"` appearance.'
        },
        preventDismiss: {
            name: 'prevent-dismiss',
            description:
                'If set, removes the "X" button that dismisses the banner.'
        },
        titleHidden: {
            name: 'title-hidden',
            description: 'If set, hides the provided title.'
        },
        dismissButtonLabel: {
            name: 'dismiss-button-label',
            description:
                'Set to a localized label (e.g. `"Close"`) for the dismiss button. This provides an accessible name for assistive technologies.'
        },
        toggle: {
            description:
                'Event emitted by the banner when the `open` state changes. The event details include the booleans `oldState` and `newState`.'
        }
    },
    args: {
        open: true,
        title: 'Title text',
        text: 'This is the body text of the banner.',
        severity: BannerSeverity.error,
        action: 'none',
        preventDismiss: false,
        titleHidden: false
    }
};

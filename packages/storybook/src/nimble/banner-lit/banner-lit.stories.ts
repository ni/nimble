import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { Theme } from '../../../../nimble-components/src/theme-provider/types';
import { iconKeyTag } from '../../../../nimble-components/src/icons/key';
import { buttonTag } from '../../../../nimble-components/src/button';
import { ButtonAppearance, ButtonAppearanceVariant } from '../../../../nimble-components/src/button/types';
import { anchorTag } from '../../../../nimble-components/src/anchor';
import { labelProviderCoreTag } from '../../../../nimble-components/src/label-provider/core';
import { popupDismissLabel } from '../../../../nimble-components/src/label-provider/core/label-tokens';
import { bannerLitTag } from '../../../../nimble-components/src/banner-lit';
import { BannerSeverityLit } from '../../../../nimble-components/src/banner-lit/types';
import {
    LabelUserArgs,
    addLabelUseMetadata
} from '../label-provider/base/label-user-stories-utils';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

// eslint-disable-next-line @typescript-eslint/naming-convention
const ActionType = {
    none: 'none',
    buttonGhost: 'button (ghost)',
    buttonOutline: 'button (outline)',
    iconButtonOutline: 'icon button (outline)',
    anchor: 'anchor'
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type ActionType = (typeof ActionType)[keyof typeof ActionType];

interface BannerLitArgs extends LabelUserArgs {
    open: boolean;
    title: string;
    text: string;
    severity: keyof typeof BannerSeverityLit;
    action: ActionType;
    preventDismiss: boolean;
    titleHidden: boolean;
    toggle: unknown;
}

const metadata: Meta<BannerLitArgs> = {
    title: 'Components/Banner Lit',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['toggle']
        }
    }
};
addLabelUseMetadata(metadata, labelProviderCoreTag, popupDismissLabel);

export default metadata;

export const _banner: StoryObj<BannerLitArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${bannerLitTag}
            ?open="${x => x.open}"
            severity="${x => BannerSeverityLit[x.severity]}"
            ?title-hidden="${x => x.titleHidden}"
            ?prevent-dismiss="${x => x.preventDismiss}"
        >
            <span slot="title">${x => x.title}</span>
            ${x => x.text}
            ${when(x => x.action === 'button (ghost)', html`
                <${buttonTag} slot="action" appearance="${ButtonAppearance.ghost}" appearance-variant="${ButtonAppearanceVariant.primary}">Do action</${buttonTag}>`)}
            ${when(x => x.action === 'button (outline)', html`
                <${buttonTag} slot="action" appearance="${ButtonAppearance.outline}" appearance-variant="${ButtonAppearanceVariant.primary}">Do action</${buttonTag}>`)}
            ${when(x => x.action === 'icon button (outline)', html`
                <${buttonTag} slot="action" appearance="${ButtonAppearance.outline}" appearance-variant="${ButtonAppearanceVariant.primary}" content-hidden>
                    <${iconKeyTag} slot="start"></${iconKeyTag}>
                    Do action
                </${buttonTag}>`)}
            ${when(x => x.action === 'anchor', html`
                <${anchorTag} slot="action" href="#">Go to site</${anchorTag}>`)}
        </${bannerLitTag}>
`),
    // eslint-disable-next-line storybook/no-redundant-story-name
    name: 'Banner',
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
            options: Object.keys(BannerSeverityLit),
            control: { type: 'radio' },
            description:
                `Severity of the message presented by the banner. Controls the icon displayed within the banner and, in themes other than \`${Theme.color}\`, controls the background color of the banner. If not set, the banner has a neutral appearance.`
        },
        action: {
            options: Object.values(ActionType),
            control: { type: 'radio' },
            description:
                'The `action` slot provides a place to display a button or anchor that you provide. If you provide a button, it should have either the `"ghost"` or `"outline"` appearance and have the `"primary"` appearance variant.'
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
        toggle: {
            description:
                'Event emitted by the banner when the `open` state changes. The event details include the booleans `oldState` and `newState`.',
            control: false
        }
    },
    args: {
        open: true,
        title: 'Title text',
        text: 'This is the body text of the banner.',
        severity: 'error',
        action: 'none',
        preventDismiss: false,
        titleHidden: false,
        toggle: undefined
    }
};

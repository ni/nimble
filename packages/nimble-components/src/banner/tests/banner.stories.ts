import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { BannerSeverity } from '../types';
import { bannerTag } from '..';
import { iconKeyTag } from '../../icons/key';
import { buttonTag } from '../../button';
import { anchorTag } from '../../anchor';
import { labelProviderCoreTag } from '../../label-provider/core';
import {
    LabelUserArgs,
    addLabelUseMetadata
} from '../../label-provider/base/tests/label-user-stories-utils';
import { popupDismissLabel } from '../../label-provider/core/label-tokens';

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

interface BannerArgs extends LabelUserArgs {
    open: boolean;
    title: string;
    text: string;
    severity: keyof typeof BannerSeverity;
    action: ActionType;
    preventDismiss: boolean;
    titleHidden: boolean;
    toggle: unknown;
}

const metadata: Meta<BannerArgs> = {
    title: 'Components/Banner',
    decorators: [withActions],
    parameters: {
        actions: {
            handles: ['toggle']
        }
    }
};
addLabelUseMetadata(metadata, labelProviderCoreTag, popupDismissLabel);

export default metadata;

export const _banner: StoryObj<BannerArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${bannerTag}
            ?open="${x => x.open}"
            severity="${x => BannerSeverity[x.severity]}"
            ?title-hidden="${x => x.titleHidden}"
            ?prevent-dismiss="${x => x.preventDismiss}"
        >
            <span slot="title">${x => x.title}</span>
            ${x => x.text}
            ${when(x => x.action === 'button (ghost)', html`
                <${buttonTag} slot="action" appearance="ghost">Do action</${buttonTag}>`)}
            ${when(x => x.action === 'button (outline)', html`
                <${buttonTag} slot="action" appearance="outline">Do action</${buttonTag}>`)}
            ${when(x => x.action === 'icon button (outline)', html`
                <${buttonTag} slot="action" appearance="outline" content-hidden>
                    <${iconKeyTag} slot="start"></${iconKeyTag}>
                    Do action
                </${buttonTag}>`)}
            ${when(x => x.action === 'anchor', html`
                <${anchorTag} slot="action" href="#">Go to site</${anchorTag}>`)}
        </${bannerTag}>
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
        toggle: {
            description:
                'Event emitted by the banner when the `open` state changes. The event details include the booleans `oldState` and `newState`.',
            control: { type: 'none' }
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

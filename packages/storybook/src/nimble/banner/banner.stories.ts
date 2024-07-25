import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '@ni/nimble-components/dist/esm/button/types';
import { anchorTag } from '@ni/nimble-components/dist/esm/anchor';
import { labelProviderCoreTag } from '@ni/nimble-components/dist/esm/label-provider/core';
import { popupDismissLabel } from '@ni/nimble-components/dist/esm/label-provider/core/label-tokens';
import { bannerTag } from '@ni/nimble-components/dist/esm/banner';
import { BannerSeverity } from '@ni/nimble-components/dist/esm/banner/types';
import {
    LabelUserArgs,
    addLabelUseMetadata
} from '../label-provider/base/label-user-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

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
    decorators: [withActions<HtmlRenderer>],
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
        </${bannerTag}>
`),
    // eslint-disable-next-line storybook/no-redundant-story-name
    name: 'Banner',
    argTypes: {
        open: {
            description: 'Controls whether the banner is visible.',
            table: { category: apiCategory.attributes }
        },
        title: {
            description:
                'Primary text which is displayed when `title-hidden` is not set. Banners should **always include a title** even when `title-hidden` is set. The title is used to provide an accessible name to assistive technologies regardless of the value of `title-hidden`.<br><br>Provide the title in an `inline` element such as `<span>`',
            table: { category: apiCategory.slots }
        },
        text: {
            name: 'default',
            description:
                'Secondary text that provides a detailed message. This text should be short enough to fit within three lines when displayed.',
            table: { category: apiCategory.slots }
        },
        severity: {
            options: Object.keys(BannerSeverity),
            control: { type: 'radio' },
            description: `Severity of the message presented by the banner. Controls the icon displayed within the banner and, in themes other than \`${Theme.color}\`, controls the background color of the banner. If not set, the banner has a neutral appearance.`,
            table: { category: apiCategory.attributes }
        },
        action: {
            options: Object.values(ActionType),
            control: { type: 'radio' },
            description:
                'Display a button or anchor which the user can click to invoke an additional action. If you provide a button, it should have either the `"ghost"` or `"outline"` appearance and have the `"primary"` appearance variant.',
            table: { category: apiCategory.slots }
        },
        preventDismiss: {
            name: 'prevent-dismiss',
            description:
                'If set, removes the "X" button that dismisses the banner.',
            table: { category: apiCategory.attributes }
        },
        titleHidden: {
            name: 'title-hidden',
            description: 'If set, hides the provided title.',
            table: { category: apiCategory.attributes }
        },
        toggle: {
            description:
                'Event emitted by the banner when the `open` state changes. The event details include the booleans `oldState` and `newState`.',
            table: { category: apiCategory.events },
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

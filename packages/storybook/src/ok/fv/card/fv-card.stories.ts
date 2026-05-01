import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvCardTag } from '@ni/ok-components/dist/esm/fv/card';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import {
    FvCardAppearance,
    type FvCardAppearance as FvCardAppearanceType,
    FvCardInteractionMode,
    type FvCardInteractionMode as FvCardInteractionModeType
} from '@ni/ok-components/dist/esm/fv/card/types';
import {
    bodyFont,
    bodyFontColor,
    controlSlimHeight,
    tooltipCaptionFont,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

interface FvCardArgs {
    title: string;
    subtitle: string;
    description: string;
    appearance: FvCardAppearanceType;
    interactionMode: FvCardInteractionModeType;
    disabled: boolean;
    initials: string;
}

const storyStyles = `
    .story-badge {
        height: var(${controlSlimHeight.cssCustomProperty});
    }

    .story-footer {
        font: var(${tooltipCaptionFont.cssCustomProperty});
        text-transform: uppercase;
    }

    ${fvCardTag} {
        width: 360px;
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
    }
`;

const metadata: Meta<FvCardArgs> = {
    title: 'Ok/Fv Card',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv card',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <${fvCardTag}
            card-title="${x => x.title}"
            subtitle="${x => x.subtitle}"
            description="${x => x.description}"
            appearance="${x => x.appearance}"
            interaction-mode="${x => x.interactionMode}"
            ?disabled="${x => x.disabled}"
            initials="${x => x.initials}"
        >
            <${chipTag}
                slot="badges"
                class="story-badge"
                appearance="${ChipAppearance.outline}"
            >
                Approved
            </${chipTag}>
            <span slot="footer-start" class="story-footer">Leftorium</span>
            <span slot="footer-end" class="story-footer">Ledger</span>
        </${fvCardTag}>
    `),
    argTypes: {
        title: {
            name: 'card-title',
            description: 'Primary heading text for the card.',
            table: { category: apiCategory.attributes }
        },
        subtitle: {
            description: 'Secondary heading text displayed below the title.',
            table: { category: apiCategory.attributes }
        },
        description: {
            description: 'Optional descriptive body text.',
            table: { category: apiCategory.attributes }
        },
        appearance: {
            description: 'Controls whether the card uses an outlined application-background shell or a filled block shell.',
            options: Object.values(FvCardAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        interactionMode: {
            name: 'interaction-mode',
            description: 'Switches between a static card shell and an interactive card-button shell.',
            options: Object.values(FvCardInteractionMode),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: 'Disables the interactive card-button shell when interaction mode is `card`.',
            table: { category: apiCategory.attributes }
        },
        initials: {
            description: 'Two-character initials fallback shown when no icon slot content is provided.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        title: 'Leftorium Ledger',
        subtitle: 'Try-N-Save annex',
        description: 'Track single-glove orders, kiosk inventory, and late-night restock notes from the mall wing.',
        appearance: FvCardAppearance.outline,
        interactionMode: FvCardInteractionMode.static,
        disabled: false,
        initials: 'LL'
    }
};

export default metadata;

export const fvCard: StoryObj<FvCardArgs> = {
    args: {
        title: 'McBain Dailies',
        subtitle: 'Soundstage vault',
        description: 'Monitor reel intake, dub approvals, and pickup slips awaiting final sign-off.',
        interactionMode: FvCardInteractionMode.card,
        initials: 'MB'
    }
};

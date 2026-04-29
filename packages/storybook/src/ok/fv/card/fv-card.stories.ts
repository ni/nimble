import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvCardTag } from '@ni/ok-components/dist/esm/fv/card';
import {
    FvCardAppearance,
    type FvCardAppearance as FvCardAppearanceType,
    FvCardInteractionMode,
    type FvCardInteractionMode as FvCardInteractionModeType
} from '@ni/ok-components/dist/esm/fv/card/types';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import {
    actionRgbPartialColor,
    bodyFont,
    bodyFontColor,
    borderRgbPartialColor,
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

const cardExampleStyle = `
    width: 360px;
    font: var(${bodyFont.cssCustomProperty});
    color: var(${bodyFontColor.cssCustomProperty});
`;

const badgeStyles = `
    .story-badges {
        display: inline-flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .story-badges ${chipTag} {
        height: var(${controlSlimHeight.cssCustomProperty});
    }

    .story-footer {
        font: var(${tooltipCaptionFont.cssCustomProperty});
        text-transform: uppercase;
    }

    nimble-theme-provider[theme='light'] .pink-badge {
        ${bodyFontColor.cssCustomProperty}: rgb(190 45 122);
        ${actionRgbPartialColor.cssCustomProperty}: 190, 45, 122;
    }

    nimble-theme-provider[theme='dark'] .pink-badge {
        ${bodyFontColor.cssCustomProperty}: rgb(255 173 220);
        ${actionRgbPartialColor.cssCustomProperty}: 255, 173, 220;
    }

    nimble-theme-provider[theme='color'] .pink-badge {
        ${bodyFontColor.cssCustomProperty}: rgb(255 199 227);
        ${actionRgbPartialColor.cssCustomProperty}: 255, 199, 227;
    }

    .pink-badge {
        ${borderRgbPartialColor.cssCustomProperty}: 190, 45, 122;
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
        <style>${badgeStyles}</style>
        <div style="${cardExampleStyle}">
            <${fvCardTag}
                title="${x => x.title}"
                subtitle="${x => x.subtitle}"
                description="${x => x.description}"
                appearance="${x => x.appearance}"
                interaction-mode="${x => x.interactionMode}"
                ?disabled="${x => x.disabled}"
                initials="${x => x.initials}"
            >
                <span slot="footer-start" class="story-footer">Administration</span>
                <span slot="footer-end" class="story-footer">v1.1.1</span>
            </${fvCardTag}>
        </div>
    `),
    argTypes: {
        title: {
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
        title: 'Plugin Manager',
        subtitle: 'NI Plugin Manager',
        description: 'A curated plugin manager for discovering and installing SystemLink extensions.',
        appearance: FvCardAppearance.outline,
        interactionMode: FvCardInteractionMode.static,
        disabled: false,
        initials: 'PM'
    }
};

export default metadata;

export const fvCard: StoryObj<FvCardArgs> = {
    args: {
        title: 'Card Title',
        subtitle: 'A subtitle goes here',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        interactionMode: FvCardInteractionMode.card,
        initials: 'FV'
    }
};

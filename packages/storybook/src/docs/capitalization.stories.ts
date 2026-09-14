import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { bannerTag } from '@ni/nimble-components/dist/esm/banner';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '@ni/nimble-components/dist/esm/button/types';
import { BannerSeverity } from '@ni/nimble-components/dist/esm/banner/types';
import {
    createUserSelectedThemeStory,
    fastParameters
} from '../utilities/storybook';

const metadata: Meta = {
    title: 'Style/Capitalization/Examples',
    parameters: {
        ...fastParameters()
    }
};

export default metadata;

export const bannerExample: StoryObj = {
    render: createUserSelectedThemeStory(html`
        <${bannerTag}
            open
            severity="${BannerSeverity.error}"
            prevent-dismiss
        >
            <span slot="title">Sentence case</span>
            Sentence case.
            <${buttonTag}
                slot="action"
                appearance="${ButtonAppearance.outline}"
                appearance-variant="${ButtonAppearanceVariant.primary}"
            >
                Sentence case
            </${buttonTag}>
        </${bannerTag}>
    `)
};

import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, repeat } from '@ni/fast-element';
import { fvSplitLayoutTag } from '@ni/ok-components/dist/esm/fv/split-layout';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

interface Args {
    width: string;
    position: number;
    minSecondaryPixels: number;
    collapsed: boolean;
    paragraphCount: number;
}

const metadata: Meta<Args> = {
    title: 'Ok/Fv Split Layout',
    render: createUserSelectedThemeStory(html<Args>`
        <${fvSplitLayoutTag} style="height: 420px; width: ${x => x.width}; max-width: 100%; font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty})" position="${x => x.position}" min-secondary-pixels="${x => x.minSecondaryPixels}" :collapsed="${x => x.collapsed}">
            <section slot="primary" style="padding: 16px">Records
                ${repeat(x => Array.from({ length: x.paragraphCount }, (_, i) => i + 1), html<number>`<p>Record ${x => x}</p>`)}
            </section>
            <aside slot="secondary" style="padding: 16px">Bulk edit
                ${repeat(x => Array.from({ length: x.paragraphCount }, (_, i) => i + 1), html<number>`<p>Field ${x => x}</p>`)}
            </aside>
        </${fvSplitLayoutTag}>
    `),
    argTypes: {
        width: { control: 'text' },
        position: { control: { type: 'number', min: 0, max: 100, step: 1 } },
        minSecondaryPixels: { control: { type: 'number', min: 0, step: 10 } },
        collapsed: { control: 'boolean' },
        paragraphCount: { control: { type: 'number', min: 0, max: 40, step: 1 } }
    },
    args: {
        width: '100%',
        position: 60,
        minSecondaryPixels: 300,
        collapsed: false,
        paragraphCount: 0
    }
};

export default metadata;
export const fvSplitLayout: StoryObj<Args> = {};

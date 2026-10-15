import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, repeat } from '@ni/fast-element';
import { fvSplitLayoutTag } from '@ni/ok-components/dist/esm/fv/split-layout';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

interface Args {
    width: string;
    collapsed: boolean;
    paragraphs: number[];
}

const metadata: Meta<Args> = {
    title: 'Ok/Fv Split Layout',
    render: createUserSelectedThemeStory(html<Args>`
        <${fvSplitLayoutTag} style="height: 420px; width: ${x => x.width}; max-width: 100%; font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty})" position="60" :collapsed="${x => x.collapsed}">
            <section slot="primary" style="padding: 16px">Records
                ${repeat(x => x.paragraphs, html<number>`<p>Record ${x => x}</p>`)}
            </section>
            <aside slot="secondary" style="padding: 16px">Bulk edit
                ${repeat(x => x.paragraphs, html<number>`<p>Field ${x => x}</p>`)}
            </aside>
        </${fvSplitLayoutTag}>
    `),
    args: { width: '100%', collapsed: false, paragraphs: [] }
};

export default metadata;
export const fvSplitLayout: StoryObj<Args> = {};
export const constrained: StoryObj<Args> = { args: { width: '800px' } };
export const collapsed: StoryObj<Args> = { args: { collapsed: true } };
export const narrow: StoryObj<Args> = { args: { width: '445px' } };
export const belowSecondaryMinimum: StoryObj<Args> = { args: { width: '280px' } };
export const independentScrolling: StoryObj<Args> = { args: { paragraphs: Array.from({ length: 40 }, (_, i) => i + 1) } };

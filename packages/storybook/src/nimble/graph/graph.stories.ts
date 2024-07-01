import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Components/Graph',
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`))
};

export default metadata;

export const graph: StoryObj = {};

import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '..';

interface WaferMapArgs {
    label: string;
}

const metadata: Meta<WaferMapArgs> = {
    title: 'Wafer Map',
    decorators: [withXD],
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <div style="height: 100vh; width: 100vh;">
            <nimble-wafer-map>
            </nimble-wafer-map>
        </div>
    `),
};

export default metadata;

export const waferMap: StoryObj<WaferMapArgs> = {
    args: {
        label: 'WaferMap',
    }
};
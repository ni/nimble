import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleThemeProvider } from '@ni/nimble-react/theme-provider';
import {
    Do,
    Dont,
    StoryGuidanceGrid,
    StoryShowcase
} from '../utilities/story-layout';
import { sharedMatrixParameters } from '../utilities/matrix';

interface LayoutArgs {
    theme: 'light' | 'dark';
}

let root: Root | undefined;

const metadata: Meta<LayoutArgs> = {
    title: 'Tests/Story Layout',
    parameters: {
        ...sharedMatrixParameters(),
        chromatic: { viewports: [480, 1440] }
    },
    beforeEach: () => () => root?.unmount(),
    render: ({ theme }) => {
        const container = document.createElement('div');
        root?.unmount();
        root = createRoot(container);
        root.render(<NimbleThemeProvider theme={theme}>
            <StoryShowcase example={<NimbleButton appearance='outline'>Example</NimbleButton>}>
                <p>Example guidance.</p>
            </StoryShowcase>
            <StoryGuidanceGrid>
                <Do title='Use clear labels' example={<NimbleButton>Save</NimbleButton>}>Describe the action.</Do>
                <Dont title='Avoid vague labels' example={<NimbleButton>Go</NimbleButton>}>Be specific.</Dont>
            </StoryGuidanceGrid>
        </NimbleThemeProvider>);
        return container;
    }
};

export default metadata;

export const lightTheme: StoryObj<LayoutArgs> = {
    args: { theme: 'light' }
};

export const darkTheme: StoryObj<LayoutArgs> = {
    args: { theme: 'dark' }
};

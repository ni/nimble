import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { NimbleButton } from '@ni/nimble-react/button';
import {
    Do,
    Dont,
    StoryApi,
    StoryGuidanceGrid,
    StoryPage,
    StorySection,
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
        root.render(<>
            <h2 id='outside-page' hidden>Outside page content</h2>
            <StoryPage theme={theme}>
                <h1>Component documentation</h1>
                <StorySection id='overview' title='Overview'>
                    <p>A shared layout with themed examples and a page-local table of contents.</p>
                    <StoryShowcase example={<NimbleButton appearance='outline'>Example</NimbleButton>}>
                        <p>Example guidance belongs to the showcase, not its internal CSS classes.</p>
                    </StoryShowcase>
                </StorySection>
                <StorySection id='usage' title='Usage'>
                    <StorySection id='guidance' title='Guidance' level={3}>
                        <StoryGuidanceGrid>
                            <Do title='Use clear labels' example={<NimbleButton>Save</NimbleButton>}>Describe the action.</Do>
                            <Dont title='Avoid vague labels' example={<NimbleButton>Go</NimbleButton>}>Be specific.</Dont>
                        </StoryGuidanceGrid>
                    </StorySection>
                    <StoryApi>
                        <p>First API block</p>
                        <p>Second API block</p>
                    </StoryApi>
                    <div style={{ minHeight: '100vh' }}>Long content before a short final section.</div>
                </StorySection>
                <StorySection id='resources' title='Resources'>
                    <p>A short final section.</p>
                </StorySection>
            </StoryPage>
        </>);
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

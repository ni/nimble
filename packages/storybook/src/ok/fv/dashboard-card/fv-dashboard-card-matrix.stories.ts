import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { fvDashboardCardTag } from '@ni/ok-components/dist/esm/fv/dashboard-card';
import {
    FvDashboardCardCorners,
    FvDashboardCardLayout,
    FvDashboardCardSeverity
} from '@ni/ok-components/dist/esm/fv/dashboard-card/types';
import { iconBellOnTag } from '@ni/nimble-components/dist/esm/icons/bell-on';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { createMatrix, createMatrixThemeStory, sharedMatrixParameters } from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Dashboard Card',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const contentStates = [
    ['Compact', false],
    ['Complete', true]
] as const;
type ContentState = (typeof contentStates)[number];

const widths = [
    ['Narrow', 220],
    ['Wide', 360]
] as const;
type Width = (typeof widths)[number];

const corners = Object.values(FvDashboardCardCorners);
const layouts = Object.values(FvDashboardCardLayout);

const component = (
    [contentName, complete]: ContentState,
    [widthName, width]: Width,
    cornerMode: FvDashboardCardCorners,
    layout: FvDashboardCardLayout
): ViewTemplate => html`
    <div style="width: ${() => width}px; margin: 8px;">
        <${fvDashboardCardTag} corners="${() => cornerMode}" layout="${() => layout}">
            <span slot="context">Dashboard card</span>
            <span slot="title">${() => `${contentName} ${widthName} ${cornerMode}`}</span>
            ${complete
                ? html`
                      <span slot="status">Ready</span>
                      <${iconBellOnTag} slot="icon" aria-hidden="true"></${iconBellOnTag}>
                      <${buttonTag} slot="actions">View details</${buttonTag}>
                      <span slot="subtitle">A concise subtitle below the title.</span>
                      <p>Primary card content.</p>
                      <span slot="supporting">Updated just now</span>
                      <span slot="footer">View details</span>
                  `
                : html`<p>Primary card content.</p>`}
        </${fvDashboardCardTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [contentStates, widths, corners, layouts])
);

export const severityMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        (severity: FvDashboardCardSeverity, layout: FvDashboardCardLayout): ViewTemplate => html`
            <${fvDashboardCardTag}
                layout="${() => layout}"
                severity="${() => severity}"
                style="width: 320px; margin: 8px;"
            >
                <${iconBellOnTag} slot="icon" aria-hidden="true"></${iconBellOnTag}>
                <span slot="title">${() => `${layout}: ${severity}`}</span>
                <span slot="subtitle">Status is communicated by text and color.</span>
            </${fvDashboardCardTag}>
        `,
        [Object.values(FvDashboardCardSeverity), layouts]
    )
);

import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, when } from '@ni/fast-element';
import { fvDashboardCardTag } from '@ni/ok-components/dist/esm/fv/dashboard-card';
import {
    FvDashboardCardCorners,
    FvDashboardCardLayout,
    FvDashboardCardSeverity
} from '@ni/ok-components/dist/esm/fv/dashboard-card/types';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/button/types';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import { iconBellOnTag } from '@ni/nimble-components/dist/esm/icons/bell-on';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { iconDatabaseCheckTag } from '@ni/nimble-components/dist/esm/icons/database-check';
import {
    bodyFont,
    cardBorderColor,
    containerBackgroundColor,
    headlineFont,
    iconColor,
    mediumPadding,
    passColor,
    smallPadding,
    standardPadding,
    warningFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { apiCategory, createUserSelectedThemeStory, okWarning } from '../../../utilities/storybook';

interface DashboardCardArgs {
    layout: FvDashboardCardLayout;
    corners: FvDashboardCardCorners;
    severity: FvDashboardCardSeverity;
    icon: 'none' | 'bell' | 'check';
    context: string;
    title: string;
    subtitle: string;
    status: 'none' | 'ready' | 'attention';
    actions: 'none' | 'one' | 'two';
    content: 'none' | 'text' | 'progress' | 'inset';
    supporting: string;
    footer: string;
}

const storyStyles = `
    .dashboard-examples {
        display: grid;
        gap: var(${standardPadding.cssCustomProperty});
        max-width: 1200px;
    }

    .dashboard-example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
        align-items: start;
        gap: var(${standardPadding.cssCustomProperty});
    }

    .dashboard-value {
        font: var(${headlineFont.cssCustomProperty});
    }

    .dashboard-value small {
        font: var(${bodyFont.cssCustomProperty});
    }

    .dashboard-chip-ready {
        color: var(${passColor.cssCustomProperty});
        border-color: currentColor;
    }

    .dashboard-chip-attention {
        color: var(${warningFontColor.cssCustomProperty});
        border-color: currentColor;
    }

    .dashboard-chip-ready [slot='start'],
    .dashboard-chip-attention [slot='start'] {
        ${iconColor.cssCustomProperty}: currentColor;
    }

    .dashboard-progress {
        display: grid;
        gap: var(${smallPadding.cssCustomProperty});
    }

    .dashboard-progress-label,
    .dashboard-inset {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(${mediumPadding.cssCustomProperty});
    }

    .dashboard-progress-label {
        justify-content: space-between;
    }

    .dashboard-progress progress {
        width: 100%;
        height: var(${smallPadding.cssCustomProperty});
        border: 0;
        appearance: none;
        background: var(${cardBorderColor.cssCustomProperty});
    }

    .dashboard-progress progress::-webkit-progress-bar {
        background: var(${cardBorderColor.cssCustomProperty});
    }

    .dashboard-progress progress::-webkit-progress-value {
        background: var(${warningFontColor.cssCustomProperty});
    }

    .dashboard-progress progress::-moz-progress-bar {
        background: var(${warningFontColor.cssCustomProperty});
    }

    .dashboard-inset {
        padding: var(${standardPadding.cssCustomProperty});
        background: var(${containerBackgroundColor.cssCustomProperty});
    }
`;

const progress = html`
    <div class="dashboard-progress">
        <div class="dashboard-progress-label" aria-hidden="true">
            <span>6 of 10 doughnuts delivered</span><span>60%</span>
        </div>
        <progress aria-label="Doughnuts delivered" value="6" max="10"></progress>
    </div>
`;

const inset = html`
    <div class="dashboard-inset">
        <span class="dashboard-value">24</span>
        <div><strong>Pink doughnuts</strong><br>Ready for delivery</div>
    </div>
`;

const metadata: Meta<DashboardCardArgs> = {
    title: 'Ok/Fv Dashboard Card',
    render: createUserSelectedThemeStory(html<DashboardCardArgs>`
        ${okWarning({
            componentName: 'fv dashboard card',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <${fvDashboardCardTag} layout="${x => x.layout}" corners="${x => x.corners}" severity="${x => x.severity}">
            ${when(x => x.icon === 'bell', html`<${iconBellOnTag} slot="icon" aria-hidden="true"></${iconBellOnTag}>`)}
            ${when(x => x.icon === 'check', html`<${iconCheckTag} slot="icon" aria-hidden="true"></${iconCheckTag}>`)}
            ${when(x => x.context.length > 0, html<DashboardCardArgs>`<span slot="context">${x => x.context}</span>`)}
            ${when(x => x.title.length > 0, html<DashboardCardArgs>`<h2 slot="title">${x => x.title}</h2>`)}
            ${when(x => x.subtitle.length > 0, html<DashboardCardArgs>`<span slot="subtitle">${x => x.subtitle}</span>`)}
            ${when(x => x.status === 'ready', html`
                <${chipTag} slot="status" appearance="${ChipAppearance.outline}" class="dashboard-chip-ready">
                    <${iconCheckTag} slot="start" aria-hidden="true"></${iconCheckTag}>Ready
                </${chipTag}>
            `)}
            ${when(x => x.status === 'attention', html`
                <${chipTag} slot="status" appearance="${ChipAppearance.outline}" class="dashboard-chip-attention">Needs attention</${chipTag}>
            `)}
            ${when(x => x.actions !== 'none', html`
                <${buttonTag} slot="actions" appearance="${ButtonAppearance.block}" appearance-variant="${ButtonAppearanceVariant.accent}">View</${buttonTag}>
            `)}
            ${when(x => x.actions === 'two', html`
                <${buttonTag} slot="actions" appearance="${ButtonAppearance.ghost}">More</${buttonTag}>
            `)}
            ${when(x => x.content === 'text', html`<div>Plan the next delivery to Springfield.</div>`)}
            ${when(x => x.content === 'progress', progress)}
            ${when(x => x.content === 'inset', inset)}
            ${when(x => x.supporting.length > 0, html<DashboardCardArgs>`<span slot="supporting">${x => x.supporting}</span>`)}
            ${when(x => x.footer.length > 0, html<DashboardCardArgs>`<span slot="footer">${x => x.footer}</span>`)}
        </${fvDashboardCardTag}>
    `),
    argTypes: {
        layout: { options: Object.values(FvDashboardCardLayout), control: 'inline-radio', table: { category: apiCategory.attributes } },
        corners: { options: Object.values(FvDashboardCardCorners), control: 'inline-radio', table: { category: apiCategory.attributes } },
        severity: { options: Object.values(FvDashboardCardSeverity), control: 'select', table: { category: apiCategory.attributes } },
        icon: { options: ['none', 'bell', 'check'], control: 'select', table: { category: apiCategory.slots } },
        context: { control: 'text', table: { category: apiCategory.slots } },
        title: { control: 'text', table: { category: apiCategory.slots } },
        subtitle: { control: 'text', table: { category: apiCategory.slots } },
        status: { options: ['none', 'ready', 'attention'], control: 'select', table: { category: apiCategory.slots } },
        actions: { options: ['none', 'one', 'two'], control: 'select', table: { category: apiCategory.slots } },
        content: { name: 'default', options: ['none', 'text', 'progress', 'inset'], control: 'select', table: { category: apiCategory.slots } },
        supporting: { control: 'text', table: { category: apiCategory.slots } },
        footer: { control: 'text', table: { category: apiCategory.slots } }
    },
    args: {
        layout: FvDashboardCardLayout.standard,
        corners: FvDashboardCardCorners.rounded,
        severity: FvDashboardCardSeverity.none,
        icon: 'none',
        context: 'Springfield bakery',
        title: 'Doughnut deliveries',
        subtitle: '',
        status: 'ready',
        actions: 'none',
        content: 'progress',
        supporting: '',
        footer: 'Updated this morning'
    }
};

export default metadata;

export const dashboardCard: StoryObj<DashboardCardArgs> = {};

export const examples: StoryObj<DashboardCardArgs> = {
    parameters: { controls: { disable: true } },
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv dashboard card',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <div class="dashboard-examples">
            <${fvDashboardCardTag} layout="hero" corners="square" severity="warning">
                <${iconBellOnTag} slot="icon" aria-hidden="true"></${iconBellOnTag}>
                <h2 slot="title">Springfield power plant alert</h2>
                <span slot="subtitle">Homer has a safety inspection to complete.</span>
                <span slot="supporting">Notice raised this morning</span>
                <${buttonTag} slot="actions" appearance="${ButtonAppearance.outline}">View details</${buttonTag}>
            </${fvDashboardCardTag}>
            <${fvDashboardCardTag} layout="hero" corners="square" severity="success">
                <${iconCheckTag} slot="icon" aria-hidden="true"></${iconCheckTag}>
                <h2 slot="title">Lisa's science project is ready</h2>
                <span slot="subtitle">The project is prepared for the school exhibition.</span>
            </${fvDashboardCardTag}>
            <div class="dashboard-example-grid">
                <${fvDashboardCardTag}>
                    <span slot="context">Springfield bakery</span>
                    <h3 slot="title">Doughnut deliveries</h3>
                    <${chipTag} slot="status" appearance="${ChipAppearance.outline}" class="dashboard-chip-attention">In progress</${chipTag}>
                    ${progress}
                    <span slot="footer">Updated this morning</span>
                </${fvDashboardCardTag}>
                <${fvDashboardCardTag}>
                    <span slot="context">Moe's Tavern</span>
                    <h3 slot="title">Bakery order</h3>
                    <${chipTag} slot="status" appearance="${ChipAppearance.outline}" class="dashboard-chip-ready">
                        <${iconCheckTag} slot="start" aria-hidden="true"></${iconCheckTag}>Ready
                    </${chipTag}>
                    ${inset}
                    <span slot="footer">Next check tomorrow</span>
                </${fvDashboardCardTag}>
                <${fvDashboardCardTag}>
                    <${iconDatabaseCheckTag} slot="icon" aria-hidden="true"></${iconDatabaseCheckTag}>
                    <span slot="context">Springfield Elementary</span>
                    <h3 slot="title">Classroom notes</h3>
                    <span slot="subtitle">Three entries added this week</span>
                    <div>Bart has three assignments to finish.</div>
                    <span slot="footer">Last updated yesterday</span>
                </${fvDashboardCardTag}>
            </div>
        </div>
    `)
};

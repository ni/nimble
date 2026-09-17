import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvStickyHeaderTag } from '@ni/ok-components/dist/esm/fv/sticky-header';
import { fvSummaryPanelTag } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { fvSummaryPanelTileTag } from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    dividerBackgroundColor,
    headerBackgroundColor,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

const storyStyles = `
    .sticky-header-story {
        min-block-size: 1200px;
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        background: var(${applicationBackgroundColor.cssCustomProperty});
    }

    .sticky-header-story__primary {
        box-sizing: border-box;
        padding: 28px 32px 24px;
        color: var(${bodyFontColor.cssCustomProperty});
        background: var(${headerBackgroundColor.cssCustomProperty});
        border-block-end: 1px solid var(${dividerBackgroundColor.cssCustomProperty});
    }

    .sticky-header-story__primary-content,
    .sticky-header-story__body {
        max-inline-size: 760px;
        margin-inline: auto;
    }

    .sticky-header-story__eyebrow {
        margin: 0 0 8px;
        color: var(${bodyFontColor.cssCustomProperty});
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .sticky-header-story__title {
        margin: 0;
        font-size: 28px;
        line-height: 1.2;
    }

    .sticky-header-story__metadata {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 24px;
        margin: 12px 0 0;
        color: var(${bodyFontColor.cssCustomProperty});
    }

    .sticky-header-story__sticky {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        box-sizing: border-box;
        min-block-size: 56px;
        padding: 12px 32px;
        color: var(${bodyFontColor.cssCustomProperty});
        background: var(${headerBackgroundColor.cssCustomProperty});
    }

    .sticky-header-story__sticky-title {
        font-weight: 600;
    }

    .sticky-header-story__sticky-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin: 0;
    }

    .sticky-header-story__sticky-nav a {
        color: inherit;
        text-decoration: none;
    }

    .sticky-header-story__sticky-nav a:first-child {
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 4px;
    }

    .sticky-header-story__body {
        padding: 48px 32px 240px;
    }

    .sticky-header-story__section {
        padding: var(${standardPadding.cssCustomProperty}) 0;
        border-block-end: 1px solid var(${dividerBackgroundColor.cssCustomProperty});
    }

    .sticky-header-story__section:first-child {
        padding-block-start: 0;
    }

    .sticky-header-story__section:last-child {
        border-block-end: 0;
    }

    .sticky-header-story__section h2 {
        margin: 0 0 12px;
        font-size: 20px;
    }

    .sticky-header-story__section p {
        max-inline-size: 620px;
        margin: 0;
        line-height: 1.6;
    }
`;

const metadata: Meta = {
    title: 'Ok/Fv Sticky Header',
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv sticky header',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <div class="sticky-header-story">
            <${fvStickyHeaderTag}>
                <header slot="header" class="sticky-header-story__primary">
                    <div class="sticky-header-story__primary-content">
                        <p class="sticky-header-story__eyebrow">Test Monitor</p>
                        <h1 class="sticky-header-story__title">System validation overview</h1>
                        <p class="sticky-header-story__metadata">
                            <span>Workspace: Lab Operations</span>
                            <span>Last updated 4 minutes ago</span>
                        </p>
                    </div>
                </header>
                <nav slot="sticky-header" class="sticky-header-story__sticky" aria-label="System validation sections">
                    <span class="sticky-header-story__sticky-title">System validation overview</span>
                    <span class="sticky-header-story__sticky-nav">
                        <a href="#runs">Runs</a>
                        <a href="#assets">Assets</a>
                        <a href="#activity">Activity</a>
                    </span>
                </nav>
            </${fvStickyHeaderTag}>
            <main class="sticky-header-story__body">
                <section class="sticky-header-story__section" id="runs">
                    <h2>Recent runs</h2>
                    <p>Review the latest validation runs, compare result trends, and open a run to inspect its individual steps.</p>
                </section>
                <section class="sticky-header-story__section" id="assets">
                    <h2>Tracked assets</h2>
                    <p>Connected systems and instruments are ready for the next scheduled validation sequence.</p>
                </section>
                <section class="sticky-header-story__section" id="activity">
                    <h2>Recent activity</h2>
                    <p>Operators approved three result sets and assigned two follow-up investigations to the lab operations queue.</p>
                </section>
            </main>
        </div>
    `),
    argTypes: {
        header: {
            description: 'Primary page header rendered in the normal document flow.',
            table: { category: apiCategory.slots },
            control: false
        },
        stickyHeader: {
            name: 'sticky-header',
            description: 'Alternate header rendered in a fixed overlay after the primary header leaves the viewport.',
            table: { category: apiCategory.slots },
            control: false
        }
    }
};

export default metadata;

export const fvStickyHeader: StoryObj = {};

const summaryPanelTiles = html`
    <${fvSummaryPanelTileTag} count="7" label="open items"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="39" label="pending reviews"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="5" label="active alerts" selected></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="1" label="new task"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="12" label="saved queries"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="3" label="shared views"></${fvSummaryPanelTileTag}>
`;

export const fvStickyHeaderWithSummaryPanel: StoryObj = {
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv sticky header',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <div class="sticky-header-story">
            <${fvStickyHeaderTag}>
                <header slot="header" class="sticky-header-story__primary">
                    <div class="sticky-header-story__primary-content">
                        <p class="sticky-header-story__eyebrow">Test Monitor</p>
                        <h1 class="sticky-header-story__title">System validation overview</h1>
                        <p class="sticky-header-story__metadata">
                            <span>Workspace: Lab Operations</span>
                            <span>Last updated 4 minutes ago</span>
                        </p>
                        <${fvSummaryPanelTag}>
                            ${summaryPanelTiles}
                        </${fvSummaryPanelTag}>
                    </div>
                </header>
                <div slot="sticky-header" class="sticky-header-story__sticky">
                    <${fvSummaryPanelTag} size="compact">
                        ${summaryPanelTiles}
                    </${fvSummaryPanelTag}>
                </div>
            </${fvStickyHeaderTag}>
            <main class="sticky-header-story__body">
                <section class="sticky-header-story__section" id="runs">
                    <h2>Recent runs</h2>
                    <p>Review the latest validation runs, compare result trends, and open a run to inspect its individual steps.</p>
                </section>
                <section class="sticky-header-story__section" id="assets">
                    <h2>Tracked assets</h2>
                    <p>Connected systems and instruments are ready for the next scheduled validation sequence.</p>
                </section>
                <section class="sticky-header-story__section" id="activity">
                    <h2>Recent activity</h2>
                    <p>Operators approved three result sets and assigned two follow-up investigations to the lab operations queue.</p>
                </section>
            </main>
        </div>
    `)
};

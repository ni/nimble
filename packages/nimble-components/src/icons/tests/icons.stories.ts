import type { Story, Meta } from '@storybook/html';
import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import "../index";
import "../delete/index";
import "../check/index";
import "../custom-applications/index";
import "../login/index";
import "../logout/index";
import "../managed-systems/index";
import "../measurement-data-analysis/index";
import "../settings/index";
import "../test-insights/index";
import "../utilities/index";
import "../access-control/index"
import "../admin/index";
import "../administration/index";
import { withXD } from 'storybook-addon-xd-designs';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';

const nimbleIcons = Object.values(nimbleIconsMap);

interface IconArgs {
    useComponents: boolean;
    label: string;
}

const styleMarkup = `
    <style>
        .container {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
        }

        .icon {
            box-sizing: border-box;
            width: 60px;
            height: 60px;
            padding: 20px;
        }

        .icon svg {
            height: 32px;
            width: 32px;
            fill: var(--content-font-color);
        }
    </style>
`;

const metadata: Meta<IconArgs> = {
    title: 'Icons',
    decorators: [withXD],
    // prettier-ignore
    render: createRenderer(html`
                ${styleMarkup}
                ${when (x => !x.useComponents, html`
                    <div class="container">
                        ${repeat(() => nimbleIcons, html<NimbleIcon>`
                            <div class="icon" title="${x => x.name}" :innerHTML="${x => x.data}"></div>
                        `)}
                    </div>`)}
                ${when (x => x.useComponents, html`
                    <nimble-delete-icon></nimble-delete-icon>
                    <nimble-check-icon></nimble-check-icon>
                    <nimble-access-control-icon></nimble-access-control-icon>
                    <nimble-login-icon></nimble-login-icon>
                    <nimble-logout-icon></nimble-logout-icon>
                    <nimble-managed-systems-icon></nimble-managed-systems-icon>
                    <nimble-test-insights-icon></nimble-test-insights-icon>
                    <nimble-settings-icon></nimble-settings-icon>
                    <nimble-utilities-icon></nimble-utilities-icon>
                    <nimble-admin-icon></nimble-admin-icon>
                    <nimble-administration-icon></nimble-administration-icon>
                    <nimble-custom-applications-icon></nimble-custom-applications-icon>
                    <nimble-measurement-data-analysis-icon><nimble-measurement-data-analysis-icon>
                `)}
            `),
    args: {
        label: 'Raw Icons',
        useComponents: false
    }
};

export default metadata;

export const rawIcons: Story<IconArgs> = {
    args: { label: 'Raw Icons', useComponents: false }
};

export const componentIcons: Story<IconArgs> = {
    args: { label: 'Component Icons', useComponents: true }
};

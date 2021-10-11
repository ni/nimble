import type { Story, Meta } from '@storybook/html';
import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import '../index';
import '../delete/index';
import '../check/index';
import '../custom-applications/index';
import '../login/index';
import '../logout/index';
import '../managed-systems/index';
import '../measurement-data-analysis/index';
import '../settings/index';
import '../test-insights/index';
import '../utilities/index';
import '../access-control/index';
import '../admin/index';
import '../administration/index';
import { withXD } from 'storybook-addon-xd-designs';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { html, repeat } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';

const nimbleIcons = Object.values(nimbleIconsMap);

enum IconStatus {
    Fail = 'fail',
    Warning = 'warning',
    Pass = 'pass',
    Regular = 'regular'
}

interface IconArgs {
    status: IconStatus;
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
    args: {
        label: 'Raw Icons',
        status: IconStatus.Regular
    },
    argTypes: {
        status: {
            options: Object.values(IconStatus),
            control: { type: 'radio' }
        }
    }
};

export default metadata;

export const rawIcons: Story<IconArgs> = {
    args: { label: 'Raw Icons' },
    render: createRenderer(html`
        ${styleMarkup}
        <div class="container">
            ${repeat(
        () => nimbleIcons,
        html<NimbleIcon>`
                    <div
                        class="icon"
                        title="${x => x.name}"
                        :innerHTML="${x => x.data}"
                    ></div>
                `
    )}
        </div>
    `)
};

export const componentIcons: Story<IconArgs> = {
    args: { label: 'Component Icons', status: IconStatus.Regular },
    render: createRenderer(html`
        <nimble-delete-icon class="${x => x.status}"></nimble-delete-icon>
        <nimble-check-icon class="${x => x.status}"></nimble-check-icon>
        <nimble-access-control-icon
            class="${x => x.status}"
        ></nimble-access-control-icon>
        <nimble-login-icon class="${x => x.status}"></nimble-login-icon>
        <nimble-logout-icon class="${x => x.status}"></nimble-logout-icon>
        <nimble-managed-systems-icon
            class="${x => x.status}"
        ></nimble-managed-systems-icon>
        <nimble-test-insights-icon
            class="${x => x.status}"
        ></nimble-test-insights-icon>
        <nimble-settings-icon class="${x => x.status}"></nimble-settings-icon>
        <nimble-utilities-icon class="${x => x.status}"></nimble-utilities-icon>
        <nimble-admin-icon class="${x => x.status}"></nimble-admin-icon>
        <nimble-administration-icon
            class="${x => x.status}"
        ></nimble-administration-icon>
        <nimble-custom-applications-icon
            class="${x => x.status}"
        ></nimble-custom-applications-icon>
        <nimble-measurement-data-analysis-icon class="${x => x.status}"
            ><nimble-measurement-data-analysis-icon>
            </nimble-measurement-data-analysis-icon
        ></nimble-measurement-data-analysis-icon>
    `)
};

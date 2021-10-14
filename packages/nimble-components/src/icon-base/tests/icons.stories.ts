import type { Story, Meta } from '@storybook/html';
import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { withXD } from 'storybook-addon-xd-designs';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { html, repeat } from '@microsoft/fast-element';
import * as nimbleIconComponentsMap from '../../icons/all-icons';
import { IconStatus } from './types';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';

const nimbleIcons = Object.values(nimbleIconsMap);
const nimbleIconComponents = Object.values(nimbleIconComponentsMap);

interface IconArgs {
    status: IconStatus;
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
    decorators: [withXD]
};

export default metadata;

// prettier-ignore
export const rawIcons: Story<IconArgs> = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    },
    render: createRenderer(html`
        ${styleMarkup}
        <div class="container">
            ${repeat(() => nimbleIcons, html<NimbleIcon>`
                <div
                    class="icon"
                    title="${x => x.name}"
                    :innerHTML="${x => x.data}"
                ></div>
            `)}
        </div>
    `)
};

// prettier-ignore
export const componentIcons: Story<IconArgs> = {
    args: { status: IconStatus.Regular },
    argTypes: {
        status: {
            options: Object.values(IconStatus),
            control: { type: 'radio' }
        }
    },
    render: createRenderer(html`
        <div class="container" :innerHTML=
            ${x => nimbleIconComponents.map(element => `<${element.iconName} class="${x.status}" title="${element.iconName}" style="padding: 5px"></${element.iconName}>`).join('')}>
        </div>
    `)
};

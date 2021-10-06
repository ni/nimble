import type { Story, Meta } from '@storybook/html';
import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { html, repeat } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';

const nimbleIcons = Object.values(nimbleIconsMap);

const styleMarkup = html`
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

const metadata: Meta = {
    title: 'Icons'
};

export default metadata;

// prettier-ignore
export const icons: Story = createRenderer(html`
    ${styleMarkup}
    <div class="container">
    ${repeat(() => nimbleIcons, html<NimbleIcon>`
        <div class="icon" title="${x => x.name}" :innerHTML="${x => x.data}"></div>
    `)}
    </div>
`);

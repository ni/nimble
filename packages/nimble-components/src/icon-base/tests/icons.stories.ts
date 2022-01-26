import type { Meta, StoryObj } from '@storybook/html';
import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { withXD } from 'storybook-addon-xd-designs';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import * as nimbleIconComponentsMap from '../../icons/all-icons';
import { IconStatus } from '../types';
import {
    createRenderer,
    overrideWarning
} from '../../utilities/tests/storybook';
import type { Icon } from '..';
import { contentFontColor } from '../../theme-provider/design-tokens';
import { tokenNames, scssInternalPropertySetterMarkdown } from '../../theme-provider/design-token-names';

const nimbleIcons = Object.values(nimbleIconsMap);
const nimbleIconComponents = Object.values(nimbleIconComponentsMap);

interface IconArgs {
    status: IconStatus;
}

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
            fill: var(${contentFontColor.cssCustomProperty});
        }
    </style>
`;

const metadata: Meta<IconArgs> = {
    title: 'Icons',
    decorators: [withXD]
};

export default metadata;

// prettier-ignore
export const rawIcons: StoryObj<IconArgs> = {
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

type IconClass = typeof Icon;
// The binding in this template generates a new template on the fly
// which is not a recommended practice by FAST. This is done because
// bindings can't be used for the element tag name, i.e.:
// static string interpolation works: html`<${tagName}></${tagName}>`
// dynamic template binding doesn't work: html`<${() => tagName}></${() => tagName}>`
const iconTemplate = html<IconClass, IconArgs>`
    ${(x, c) => html`
        <${DesignSystem.tagFor(x)}
            class="${c.parent.status}"
            title=${DesignSystem.tagFor(x)}
            style="padding: 5px;"
        >
        </${DesignSystem.tagFor(x)}>
    `}
`;

const statusDescriptionOvverride = `
With SCSS properties, the icon color can be overriden. For example:
${scssInternalPropertySetterMarkdown(tokenNames.iconColor, 'purple')}
`;

const statusDescription = `
Set the \`pass\`, \`fail\`, or \`warning\` CSS class on the element to switch between the theme-aware color options.

${overrideWarning('Color', statusDescriptionOvverride)}
`;

// prettier-ignore
export const componentIcons: StoryObj<IconArgs> = {
    args: { status: IconStatus.Regular },
    argTypes: {
        status: {
            options: Object.values(IconStatus),
            control: { type: 'radio' },
            description: statusDescription
        }
    },
    render: createRenderer(html`
        <div class="container">
            ${repeat(() => nimbleIconComponents, iconTemplate)}
        </div>
    `)
};

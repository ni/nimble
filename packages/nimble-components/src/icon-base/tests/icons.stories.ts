import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import * as nimbleIconComponentsMap from '../../icons/all-icons';
import { IconAppearance } from '../types';
import {
    createUserSelectedThemeStory,
    overrideWarning
} from '../../utilities/tests/storybook';
import type { Icon } from '..';
import {
    tokenNames,
    scssInternalPropertySetterMarkdown
} from '../../theme-provider/design-token-names';

const nimbleIconComponents = Object.values(nimbleIconComponentsMap);

interface IconArgs {
    status: IconAppearance;
}

const metadata: Meta<IconArgs> = {
    title: 'Icons'
};

export default metadata;

type IconClass = typeof Icon;
// The binding in this template generates a new template on the fly
// which is not a recommended practice by FAST. This is done because
// bindings can't be used for the element tag name, i.e.:
// static string interpolation works: html`<${tagName}></${tagName}>`
// dynamic template binding doesn't work: html`<${() => tagName}></${() => tagName}>`
const iconTemplate = html<IconClass, IconArgs>`
    ${(x, c) => html`
        <${DesignSystem.tagFor(x)}
            appearance=${() => c.parent.status}
            title=${DesignSystem.tagFor(x)}
        >
        </${DesignSystem.tagFor(x)}>
    `}
`;

const statusDescriptionOverride = `
With SCSS properties, the icon color can be overriden. For example:
${scssInternalPropertySetterMarkdown(tokenNames.iconColor, 'purple')}
`;

const statusDescription = `
Set appearance on the element to switch between the theme-aware color options.

${overrideWarning('Color', statusDescriptionOverride)}
`;

// prettier-ignore
export const icons: StoryObj<IconArgs> = {
    args: { status: IconAppearance.default },
    argTypes: {
        status: {
            options: Object.values(IconAppearance),
            control: { type: 'radio' },
            description: statusDescription
        }
    },
    render: createUserSelectedThemeStory(html`
        <style class="code-hide">
            .container > * {
                padding: 5px;
            }
        </style>
        <div class="container">
            ${repeat(() => nimbleIconComponents, iconTemplate)}
        </div>
    `)
};

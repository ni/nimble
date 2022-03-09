import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { createMatrix, themeWrapper } from '../../utilities/tests/matrix';
import '..';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Breadcrumb',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e/specs/'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

type LinkHrefState = [string, string | null];
const linkHrefStates: LinkHrefState[] = [
    ['Link', parent.location.href],
    ['Current (No Link)', null]
];

type BreadcrumbStyleState = [string, string];
const breadcrumbStyleStates: BreadcrumbStyleState[] = [
    ['', ''],
    [' (Prominent Links style)', 'prominent-links']
];
const component = ([linkHrefName, href]: LinkHrefState, [styleStateName, style]: BreadcrumbStyleState): ViewTemplate => html`
    <nimble-breadcrumb class="${() => style}">
        <nimble-breadcrumb-item href="${() => href}">
            ${() => `Breadcrumb${styleStateName} - ${linkHrefName}`}
        </nimble-breadcrumb-item>
    </nimble-breadcrumb>
`;
export const breadcrumbThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [linkHrefStates, breadcrumbStyleStates]))
);

export const hiddenBreadcrumb: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-breadcrumb hidden>
            <nimble-breadcrumb-item href="#">Item 1</nimble-breadcrumb-item>
            <nimble-breadcrumb-item>Current (No Link)</nimble-breadcrumb-item>
        </nimble-breadcrumb>`
    )
);

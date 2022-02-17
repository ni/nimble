import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { createMatrix, themeWrapper } from '../../utilities/tests/matrix';
import '..';
import { BreadcrumbItemAppearance } from '../../breadcrumb-item/types';

const metadata: Meta = {
    title: 'Tests/Breadcrumb',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e/specs/'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

type LinkHrefState = [string, string | null];
const linkHrefStates: LinkHrefState[] = [
    ['Link', '#'],
    ['Visited/Current', parent.location.href],
    ['No Link', null]
];

const appearanceStates = Object.entries(BreadcrumbItemAppearance);
type AppearanceState = typeof appearanceStates[number];

const component = (
    [appearanceName, appearance]: AppearanceState,
    [linkHrefName, href]: LinkHrefState
): ViewTemplate => html`
    <nimble-breadcrumb>
        <nimble-breadcrumb-item
            appearance="${() => appearance}"
            href="${() => href}"
        >
            ${() => `${appearanceName} Breadcrumb - ${linkHrefName}`}
        </nimble-breadcrumb-item>
    </nimble-breadcrumb>
`;

export const breadcrumbThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [appearanceStates, linkHrefStates]))
);

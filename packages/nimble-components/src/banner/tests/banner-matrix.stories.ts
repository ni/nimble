import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Banner',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29c405f7-08ea-48b6-973f-546970b9dbab/specs/'
        }
    }
};

export default metadata;

const severityStates = [
    ['Neutral', undefined],
    ['Error', 'error'],
    ['Warning', 'warning'],
    ['Info', 'info']
] as const;
type SeverityState = typeof severityStates[number];

const actionStates = [
    ['', false, undefined],
    ['link', true, undefined],
    ['ghost button', false, 'ghost'],
    ['outline button', false, 'outline']
] as const;
type ActionState = typeof actionStates[number];

const partsHiddenStates = [
    ['', false],
    ['parts hidden', true]
] as const;
type PartsHiddenState = typeof partsHiddenStates[number];

// prettier-ignore
const component = (
    [severityLabel, severity]: SeverityState,
    [actionLabel, linkVisible, buttonAppearance]: ActionState,
    [partsHiddenLabel, partsHidden]: PartsHiddenState
): ViewTemplate => html`
    <nimble-banner
        open
        severity="${severity!}"
        title-hidden="${partsHidden}"
        prevent-dismiss="${partsHidden}"
    >
        <span slot="title">${severityLabel} ${actionLabel} ${partsHiddenLabel}</span>
        This is message text.
        ${when(() => linkVisible, html`
            <nimble-anchor slot="action" href="#">Nimble anchor</nimble-anchor>
        `)}
        ${when(() => buttonAppearance, html`
            <nimble-button slot="action" appearance="${buttonAppearance!}">Nimble Button</nimble-button>
        `)}
    </nimble-banner>
    <div style="height: 1px"></div>
`;

export const bannerThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        severityStates,
        actionStates,
        partsHiddenStates
    ])
);

export const textWrapBanner: Story = createStory(
    html`<nimble-banner open severity="error">
        <span slot="title">${loremIpsum.substring(0, 78)}</span>
        ${loremIpsum}
        <nimble-anchor slot="action" href="#"
            >${loremIpsum.substring(0, 78)}</nimble-anchor
        >
    </nimble-banner>`
);

export const hiddenBanner: Story = createStory(
    hiddenWrapper(
        html`<nimble-banner hidden>
            <span slot="title">Hidden banner</span>
        </nimble-banner>`
    )
);

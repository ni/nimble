import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import { BannerSeverity } from '../types';
import { bannerGapSize } from '../../theme-provider/design-tokens';
import { bannerTag } from '..';
import { buttonTag } from '../../button';
import { anchorTag } from '../../anchor';
import { iconKeyTag } from '../../icons/key';

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

const severityStates: [string, string | undefined][] = Object.entries(
    BannerSeverity
).map(([key, value]) => [pascalCase(key), value]);
type SeverityState = (typeof severityStates)[number];

const actionStates = [
    ['', false, false, undefined],
    ['link', true, false, undefined],
    ['ghost button', false, false, 'ghost'],
    ['outline button', false, false, 'outline'],
    ['outline icon button', false, true, 'outline']
] as const;
type ActionState = (typeof actionStates)[number];

const partsHiddenStates = [
    ['', false],
    ['parts hidden', true]
] as const;
type PartsHiddenState = (typeof partsHiddenStates)[number];

const longTextStates = [
    ['', false],
    ['long text', true]
] as const;
type LongTextState = (typeof longTextStates)[number];

// prettier-ignore
const component = (
    [severityLabel, severity]: SeverityState,
    [actionLabel, linkVisible, iconButton, buttonAppearance]: ActionState,
    [partsHiddenLabel, partsHidden]: PartsHiddenState,
    [longTextLabel, longText]: LongTextState
): ViewTemplate => html`
    <${bannerTag}
        open
        severity="${() => severity}"
        title-hidden="${partsHidden}"
        prevent-dismiss="${partsHidden}"
    >
        <span slot="title">${severityLabel} ${actionLabel} ${partsHiddenLabel} ${longTextLabel} ${longText ? loremIpsum.substring(0, 78) : ''}</span>
        ${longText ? loremIpsum : 'This is message text.'}
        ${when(() => linkVisible, html`
            <${anchorTag} slot="action" href="#">${longText ? loremIpsum.substring(0, 78) : 'Nimble anchor'}</${anchorTag}>
        `)}
        ${when(() => buttonAppearance, html`
            <${buttonTag} slot="action" appearance="${buttonAppearance!}" content-hidden=${iconButton}>
                ${when(() => iconButton, html`
                    <${iconKeyTag} slot="start"></${iconKeyTag}>
                `)}
                ${longText ? loremIpsum.substring(0, 78) : 'Nimble Button'}
            </${buttonTag}>
        `)}
    </${bannerTag}>
    <div style="height: var(${bannerGapSize.cssCustomProperty})"></div>
`;

export const bannerThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        severityStates,
        actionStates,
        partsHiddenStates,
        longTextStates
    ])
);

export const hiddenBanner: Story = createStory(
    hiddenWrapper(
        html`<${bannerTag} hidden>
            <span slot="title">Hidden banner</span>
        </${bannerTag}>`
    )
);

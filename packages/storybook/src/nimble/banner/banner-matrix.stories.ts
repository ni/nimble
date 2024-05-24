import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { bannerGapSize } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { buttonTag } from '../../../../nimble-components/src/button';
import { anchorTag } from '../../../../nimble-components/src/anchor';
import { iconKeyTag } from '../../../../nimble-components/src/icons/key';
import { bannerTag } from '../../../../nimble-components/src/banner';
import { BannerSeverity } from '../../../../nimble-components/src/banner/types';
import { createStory } from '../../utilities/storybook';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const actionStates = [
    ['', false, false, undefined],
    ['link', true, false, undefined],
    ['ghost button', false, false, 'ghost'],
    ['outline button', false, false, 'outline'],
    ['outline icon button', false, true, 'outline']
] as const;
type ActionState = (typeof actionStates)[number];

const longTextStates = [
    ['', false],
    ['long text', true]
] as const;
type LongTextState = (typeof longTextStates)[number];

const partsHiddenStates = [
    ['', false],
    ['parts hidden', true]
] as const;
type PartsHiddenState = (typeof partsHiddenStates)[number];

const severityStates = [
    ['Default', BannerSeverity.default],
    ['Error', BannerSeverity.error],
    ['Warning', BannerSeverity.warning],
    ['Information', BannerSeverity.information]
] as const;
type SeverityState = (typeof severityStates)[number];

const metadata: Meta = {
    title: 'Tests/Banner',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

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

export const bannerThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        severityStates,
        actionStates,
        partsHiddenStates,
        longTextStates
    ])
);

export const hiddenBanner: StoryFn = createStory(
    hiddenWrapper(
        html`<${bannerTag} hidden>
            <span slot="title">Hidden banner</span>
        </${bannerTag}>`
    )
);

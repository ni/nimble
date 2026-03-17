import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { disabledStates, type DisabledState } from '../../utilities/states';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const appearanceStates = [
    ['Outline', ChipAppearance.outline],
    ['Block', ChipAppearance.block]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const removableStates = [
    ['Removable', true],
    ['Not Removable', false]
] as const;
type RemovableStates = (typeof removableStates)[number];

const showStartSlotIconStates = [
    ['Show Icon', true],
    ['Hide Icon', false]
] as const;
type ShowStartSlotIconState = (typeof showStartSlotIconStates)[number];
const showStartSlotIconStatesOnlyIcon = showStartSlotIconStates[0];

const labelStates = [
    ['Short Label', 'Option Label'],
    [
        'Long Label',
        'A very long label that will likely overflow the chip and require truncation with set width'
    ]
] as const;
type LabelState = (typeof labelStates)[number];
const labelStatesOnlyShort = labelStates[0];

const widthStates = [
    ['Default Width', ''],
    ['Custom Width', 'width: 250px;']
] as const;
type WidthState = (typeof widthStates)[number];
const widthStatesOnlyDefault = widthStates[0];

const metadata: Meta = {
    title: 'Tests/Chip',
    parameters: {
        ...sharedMatrixParameters()
    }
};
export default metadata;

const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [removableName, removable]: RemovableStates,
    [showStartSlotIconName, showStartSlotIcon]: ShowStartSlotIconState,
    [labelName, label]: LabelState,
    [widthName, width]: WidthState
): ViewTemplate => html`
    <div style="display: flex; flex-direction: column;">
        <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
            ${appearanceName}, ${removableName}, ${showStartSlotIconName}, ${labelName}, ${widthName}, ${disabledName ? `(${disabledName})` : ''} 
        </label> 
        <${chipTag}
            appearance="${() => appearance}"
            ?removable="${() => removable}"
            ?disabled=${() => disabled}
            style="margin-right: 8px; margin-bottom: 8px; ${() => width};">
                ${when(() => showStartSlotIcon, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
                ${label}
        </${chipTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        removableStates,
        showStartSlotIconStates,
        labelStates,
        widthStates
    ])
);

const interactionStates = cartesianProduct([
    disabledStates,
    appearanceStates,
    removableStates,
    [showStartSlotIconStatesOnlyIcon],
    [labelStatesOnlyShort],
    [widthStatesOnlyDefault]
] as const);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    appearanceStates,
    removableStates,
    [showStartSlotIconStatesOnlyIcon],
    [labelStatesOnlyShort],
    [widthStatesOnlyDefault]
] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: [],
        focus: interactionStates,
        active: []
    })
);
export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${chipTag}>Option Label</${chipTag}>`)
);

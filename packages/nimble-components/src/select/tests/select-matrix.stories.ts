import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    ErrorState,
    errorStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { DropdownAppearance } from '../../patterns/dropdown/types';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import {
    controlLabelFont,
    controlLabelFontColor,
    standardPadding
} from '../../theme-provider/design-tokens';
import { selectTag } from '..';
import { listOptionTag } from '../../list-option';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        }
    }
};

export default metadata;

const appearanceStates = Object.entries(DropdownAppearance).map(
    ([key, value]) => [pascalCase(key), value]
);

type AppearanceState = (typeof appearanceStates)[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [errorName, errorVisible, errorText]: ErrorState,
): ViewTemplate => html`
    <div style="
        display: inline-flex;
        flex-direction: column;
        margin: var(${standardPadding.cssCustomProperty});
        font: var(${controlLabelFont.cssCustomProperty});
        color: var(${controlLabelFontColor.cssCustomProperty});"
    >
        <label>${() => errorName} ${() => disabledName} ${() => appearanceName}</label>
        <${selectTag}
            ?error-visible="${() => errorVisible}"
            error-text="${() => errorText}"
            ?disabled="${() => disabled}"
            appearance="${() => appearance}"
        >
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
            <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
        </${selectTag}>
    </div>
`;

export const selectThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates, appearanceStates, errorStates])
);

export const hiddenSelect: Story = createStory(
    hiddenWrapper(
        html`<${selectTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${selectTag}>`
    )
);

export const blankListOption: Story = createStory(
    html`<${selectTag} open>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag}></${listOptionTag}>
    </${selectTag}>`
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${selectTag}>
                Inner text
                <${listOptionTag}> Nimble select item </${listOptionTag}>
            </${selectTag}>
        `
    )
);

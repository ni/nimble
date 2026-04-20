import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { type FvSearchInput, fvSearchInputTag } from '@ni/ok-components/dist/esm/fv-search-input';
import { FvSearchInputAppearance } from '@ni/ok-components/dist/esm/fv-search-input/types';
import { FvSearchInputPageObject } from '@ni/ok-components/dist/esm/fv-search-input/testing/fv-search-input.pageobject';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrixInteractionsFromStates,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/FV Search Input',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

type SearchInputMatrixState = readonly [string, keyof typeof FvSearchInputAppearance];

const searchInputStates: SearchInputMatrixState[] = [
    ['block', 'block'],
    ['outline', 'outline'],
    ['underline', 'underline'],
    ['frameless', 'frameless']
];

const matrixContainerStyle = `
    padding: 28px 32px;
    width: 760px;
    font: var(${bodyFont.cssCustomProperty});
    color: var(${bodyFontColor.cssCustomProperty});
`;

const searchField = (
    label: string,
    appearance: keyof typeof FvSearchInputAppearance
): ViewTemplate => html`
    <div style="display: grid; grid-template-columns: 152px 160px; align-items: center; row-gap: 0; column-gap: 10px; margin-bottom: 14px;">
        <div style="font-size: 12px; color: inherit;">${() => label}</div>
        <${fvSearchInputTag}
            appearance="${() => FvSearchInputAppearance[appearance]}"
            placeholder="Search..."
            style="width: 124px; --ok-search-input-height: 32px;"
        ></${fvSearchInputTag}>
    </div>
`;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="${matrixContainerStyle}">
        ${searchField('Search_Block_Light_32', 'block')}
        ${searchField('Search_Outline_Light_32', 'outline')}
        ${searchField('Search_Underline_Light_32', 'underline')}
        ${searchField('Search_Frameless_Light_32', 'frameless')}
    </div>
`);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(
        (label: string, appearance: keyof typeof FvSearchInputAppearance): ViewTemplate => html`
            <div style="display: inline-flex; flex-direction: column; gap: 12px; margin: 0 20px 24px 0; min-width: 140px;">
                <div style="font-size: 12px; color: inherit; min-height: 16px;">${() => label}</div>
                <${fvSearchInputTag}
                    appearance="${() => FvSearchInputAppearance[appearance]}"
                    placeholder="Search..."
                    style="width: 124px; --ok-search-input-height: 32px;"
                ></${fvSearchInputTag}>
            </div>
        `,
        {
            hover: searchInputStates,
            hoverActive: [],
            active: [],
            focus: searchInputStates
        }
    )
);

export const typedThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="${matrixContainerStyle}">
        ${searchField('Typed_Block_Light_32', 'block')}
        ${searchField('Typed_Outline_Light_32', 'outline')}
        ${searchField('Typed_Underline_Light_32', 'underline')}
        ${searchField('Typed_Frameless_Light_32', 'frameless')}
    </div>
`);

typedThemeMatrix.play = async ({ step }): Promise<void> => {
    const searchInputs = Array.from(document.querySelectorAll<FvSearchInput>(fvSearchInputTag));

    await step('Type search text into each input', async () => {
        await Promise.all(searchInputs.map(async searchInput => {
            const pageObject = new FvSearchInputPageObject(searchInput);
            await pageObject.typeText('Search');
        }));
    });
};
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat } from '@microsoft/fast-element';
import nimbleColorsMapJson from '@ni/nimble-tokens/dist/styledictionary/properties/colors.json';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import {
    labelFontColor,
    labelFontFamily,
    labelFontSize,
    labelFontWeight
} from '../design-tokens';

interface NimbleColor {
    name: string;
    data: string;
}

const nimbleBaseColors: NimbleColor[] = Object.entries(
    nimbleColorsMapJson.color
).map(([key, valueObj]) => ({
    name: key,
    data: valueObj.value
}));

const styleMarkup = html`
    <style>
        .container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            grid-column-gap: 10px;
            grid-row-gap: 10px;
        }

        .color-option {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
        }

        .color-box {
            box-sizing: border-box;
            width: 80px;
            height: 80px;
            border-radius: 5px;
            border: 1px solid lightgray;
        }

        .color-label {
            font-family: var(${labelFontFamily.cssCustomProperty});
            font-size: var(${labelFontSize.cssCustomProperty});
            font-weight: var(${labelFontWeight.cssCustomProperty});
            color: var(${labelFontColor.cssCustomProperty});
            text-align: center;
        }
    </style>
`;

const overviewText = `Base colors are defined by the visual design team, managed in the <a href='https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/89e665af-d24c-4f5e-b547-294caeccd29a'>Nimble_Component</a> Adobe XD spec, and exported in <code>nimble-tokens</code>.
Most client applications shouldn't use these tokens directly. See the <a href="https://github.com/ni/nimble/tree/main/packages/nimble-tokens">nimble-token</a> readme for more information.`;

const metadata: Meta = {
    title: 'Tokens/Base Colors',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/89e665af-d24c-4f5e-b547-294caeccd29a/specs/'
        }
    }
};

export default metadata;

// prettier-ignore
export const baseColors: StoryObj = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    },
    render: createRenderer(html`
        ${styleMarkup}
        <div class="container">
            ${repeat(() => nimbleBaseColors, html<NimbleColor>`
                <div class="color-option">
                    <div
                        class="color-box"
                        title="${x => x.name}"
                        style='background: ${x => x.data}'
                    ></div>
                    <div class="color-label">${x => x.name}<br/>${x => x.data}</div>
                </div>
            `)}
        </div>
    `)
};

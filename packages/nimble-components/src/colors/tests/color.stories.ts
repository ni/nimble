import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat } from '@microsoft/fast-element';
import * as nimbleColorsMapJson from '@ni/nimble-tokens/dist/styledictionary/properties/colors.json';
import { createRenderer } from '../../utilities/tests/storybook';

interface NimbleColor {
    name: string;
    data: string;
}

const nimbleBaseColors: NimbleColor[] = [];
const colorObj = nimbleColorsMapJson.color;

let key: keyof typeof colorObj;

for (key in colorObj) {
    if (Object.prototype.hasOwnProperty.call(colorObj, key)) {
        nimbleBaseColors.push({
            name: key,
            data: colorObj[key].value
        });
    }
}

const styleMarkup = `
    <style>
        .container {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: left;
            align-items: center;
            flex-wrap: wrap;
        }

        .color {
            box-sizing: border-box;
            width: 60px;
            height: 60px;
            padding: 40px;
            margin: 40px;
            margin-bottom: 10px;
            border-radius: 5px;
            border: 1px solid lightgray;
        }

        p {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: gray;
            text-align: center;
            margin: 10px;
        }

    </style>
`;

const metadata: Meta = {
    title: 'Colors',
    decorators: [withXD]
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
                <div>
                    <div
                        class="color"
                        title="${x => x.name}"
                        style='background: ${x => x.data}'
                    ></div>
                    <p>${x => x.name}</p>
                </div>
            `)}
        </div>
    `)
};

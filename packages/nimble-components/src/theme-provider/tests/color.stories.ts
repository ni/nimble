import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat } from '@microsoft/fast-element';
import * as tokens from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { controlLabelFont, controlLabelFontColor } from '../design-tokens';

interface NimbleColor {
    name: string;
    data: string;
}

const colorRegExp = /^#([0-9a-zA-Z]{6})$/;
const nimbleBaseColors: NimbleColor[] = Object.entries(tokens)
    .filter(([_key, value]) => colorRegExp.test(value))
    .map(([key, value]) => ({
        name: key,
        data: value
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
            font: var(${controlLabelFont.cssCustomProperty});
            color: var(${controlLabelFontColor.cssCustomProperty});
            text-align: center;
        }
    </style>
`;

const metadata: Meta = {
    title: 'Tokens/Base Colors',
    parameters: {
        docs: {
            source: {
                code: null
            }
        }
    }
};

export default metadata;

// prettier-ignore
export const baseColors: StoryObj = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    },
    render: createUserSelectedThemeStory(html`
        <div class="container">
            ${styleMarkup}
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

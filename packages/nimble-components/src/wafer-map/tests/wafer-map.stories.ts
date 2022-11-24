import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';

import '../../all-components';
import type { WaferMapDie, WaferMapColorsScale } from '../types';
import {
    WaferMapQuadrant,
    WaferMapOrientation,
    WaferMapColorsScaleMode
} from '../types';
import {
    HIGHLIGHTEDVALUESETS,
    WAFERMAPDIESETS,
    WAFERMAPCOLORSCALESETS
} from './sets';

interface WaferMapArgs {
    quadrant: WaferMapQuadrant;
    orientation: WaferMapOrientation;
    maxCharacters: number;
    dieLabelsHidden: boolean;
    dieLabelsSuffix: string;
    colorsScaleMode: WaferMapColorsScaleMode;
    highlightedValues: number[];
    dies: WaferMapDie[];
    colorScale: WaferMapColorsScale;
}

const metadata: Meta<WaferMapArgs> = {
    title: 'Wafermap',
    parameters: {
        docs: {
            description: {
                component: 'A Wafermap description'
            }
        },
        actions: {
            handles: ['click', 'mouseover']
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-wafer-map
            id="wafermapEl"
            quadrant="${x => x.quadrant}"
            orientation="${x => x.orientation}"
            maxCharacters="${x => x.maxCharacters}"
            dieLabelsHidden="${x => x.dieLabelsHidden}"
            dieLabelsSuffix="${x => x.dieLabelsSuffix}"
            colorsScaleMode="${x => x.colorsScaleMode}"
            :highlightedValues="${x => x.highlightedValues}"
            :colorScale="${x => x.colorScale}"
            :dies=${x => x.dies}
        >
        </nimble-wafer-map>
    `),
    args: {
        dies: WAFERMAPDIESETS[0],
        quadrant: WaferMapQuadrant.bottomLeft,
        orientation: WaferMapOrientation.left,
        colorScale: WAFERMAPCOLORSCALESETS[0],
        maxCharacters: 4,
        dieLabelsHidden: false,
        dieLabelsSuffix: '',
        colorsScaleMode: WaferMapColorsScaleMode.linear,
        highlightedValues: HIGHLIGHTEDVALUESETS[0]
    },
    argTypes: {
        dies: {
            description:
                'Represents the input data, an array of WaferMapDie, which will be renedered by the Wafermap',
            options: ['set1', 'set2'],
            control: {
                type: 'select',
                labels: {
                    set1: 'Dies Set 1',
                    set2: 'Dies Set 2'
                }
            },
            mapping: {
                set1: WAFERMAPDIESETS[0],
                set2: WAFERMAPDIESETS[1]
            }
        },
        quadrant: {
            description:
                'Represents the orientation of the dies on the wafer map',
            options: Object.values(WaferMapQuadrant),
            control: {
                type: 'select',
                labels: {
                    [WaferMapQuadrant.bottomLeft]: 'BottomLeft',
                    [WaferMapQuadrant.bottomRight]: 'BottomRight',
                    [WaferMapQuadrant.topLeft]: 'TopLeft',
                    [WaferMapQuadrant.topRight]: 'TopRight'
                }
            }
        },
        orientation: {
            description: 'Notch orientation',
            options: Object.values(WaferMapOrientation),
            control: {
                type: 'select',
                labels: {
                    [WaferMapOrientation.left]: 'Left',
                    [WaferMapOrientation.top]: 'Top',
                    [WaferMapOrientation.right]: 'Right',
                    [WaferMapOrientation.bottom]: 'Bottom'
                }
            }
        },
        maxCharacters: {
            description:
                'Represents the number of characters allowed to be displayed within a single die. As the die values are represented by Floating point numbers, we must have the liberty of limiting how many characters we are willing to display within a single die.',
            control: { type: 'number' }
        },
        dieLabelsHidden: {
            description:
                'Boolean value that determines if the dies labels in the wafer map view are shown or not. Default value is false.',
            control: { type: 'boolean' }
        },
        dieLabelsSuffix: {
            description:
                'String that can be added as a label at the end of each wafer map die value',
            control: { type: 'string' }
        },
        colorsScaleMode: {
            description:
                'Enum value that determines if the colorScale represents continuous gradient values (linear), or is set categorically (ordinal).',
            options: Object.values(WaferMapColorsScaleMode),
            control: {
                type: 'select',
                labels: {
                    [WaferMapColorsScaleMode.linear]: 'Linear',
                    [WaferMapColorsScaleMode.ordinal]: 'Ordinal'
                }
            }
        },
        highlightedValues: {
            description:
                'Represents an array of die indexes that will be highlighted in the wafer map view',
            options: ['set1', 'set2', 'set3', 'set4'],
            control: {
                type: 'select',
                labels: {
                    set1: 'Highlighted Values Set 1',
                    set2: 'Highlighted Values Set 2',
                    set3: 'Highlighted Values Set 3',
                    set4: 'Highlighted Values Set 4'
                }
            },
            mapping: {
                set1: HIGHLIGHTEDVALUESETS[0],
                set2: HIGHLIGHTEDVALUESETS[1],
                set3: HIGHLIGHTEDVALUESETS[2],
                set4: HIGHLIGHTEDVALUESETS[3]
            }
        },
        colorScale: {
            description:
                'Represents the color spectrum which shows the status of the dies on the wafer.',
            options: ['set1'],
            control: {
                type: 'select',
                labels: {
                    set1: 'Color Scale 1'
                }
            },
            mapping: {
                set1: WAFERMAPCOLORSCALESETS[0]
            }
        }
    }
};

export default metadata;

export const waferMap: StoryObj<WaferMapArgs> = {};

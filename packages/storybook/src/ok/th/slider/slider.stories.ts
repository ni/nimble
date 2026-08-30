import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { sliderTag } from '@ni/ok-components/dist/esm/th/slider';
import { withActions } from 'storybook/actions/decorator';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    okWarning
} from '../../../utilities/storybook';

interface SliderArgs {
    value: number;
    min: number;
    max: number;
    step: number;
    orientation: 'horizontal' | 'vertical';
    disabled: boolean;
    readOnly: boolean;
    valueVisible: boolean;
    change?: (event: Event) => void;
}

const metadata: Meta<SliderArgs> = {
    title: 'Ok/Th Slider',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html<SliderArgs>`
        ${okWarning({
            componentName: 'Th Slider',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${sliderTag}
            style="${x => x.orientation === 'horizontal' ? `width: 200px;` : `height: 200px;`}"
            value="${x => x.value}"
            min="${x => x.min}"
            max="${x => x.max}"
            step="${x => x.step}"
            orientation="${x => x.orientation}"
            ?disabled="${x => x.disabled}"
            ?readonly="${x => x.readOnly}"
            ?value-visible="${x => x.valueVisible}"
        ></${sliderTag}>
    `),
    argTypes: {
        value: {
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        min: {
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        max: {
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        step: {
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        orientation: {
            options: ['horizontal', 'vertical'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'slider' }),
            table: { category: apiCategory.attributes }
        },
        readOnly: {
            name: 'readonly',
            table: { category: apiCategory.attributes }
        },
        valueVisible: {
            name: 'value-visible',
            description: 'Displays the current value next to the slider thumb.',
            table: { category: apiCategory.attributes }
        },
        change: {
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        value: 40,
        min: 0,
        max: 100,
        step: 1,
        orientation: 'horizontal',
        disabled: false,
        readOnly: false,
        valueVisible: true
    }
};

export default metadata;

export const slider: StoryObj<SliderArgs> = {};

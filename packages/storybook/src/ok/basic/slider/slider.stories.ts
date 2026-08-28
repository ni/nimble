import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { sliderTag } from '@ni/ok-components/dist/esm/basic/slider';
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
    change?: (event: Event) => void;
}

const metadata: Meta<SliderArgs> = {
    title: 'Ok/Basic Slider',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html<SliderArgs>`
        ${okWarning({
            componentName: 'Basic Slider',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${sliderTag}
            value="${x => x.value}"
            min="${x => x.min}"
            max="${x => x.max}"
            step="${x => x.step}"
            orientation="${x => x.orientation}"
            ?disabled="${x => x.disabled}"
            ?readonly="${x => x.readOnly}"
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
        change: {
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        orientation: 'horizontal',
        disabled: false,
        readOnly: false
    }
};

export default metadata;

export const slider: StoryObj<SliderArgs> = {};

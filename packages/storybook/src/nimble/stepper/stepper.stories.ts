import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import {
    apiCategory,
    createUserSelectedThemeStory,
    // incubatingWarning
} from '../../utilities/storybook';
import { ExampleStepType } from './types';

interface StepperArgs {
    stepType: ExampleStepType;
}

const metadata: Meta<StepperArgs> = {
    title: 'Incubating/Stepper',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
    ${'' /* incubatingWarning({
        componentName: stepperTag,
        statusLink: 'https://github.com/ni/nimble/issues/624'
    }) */}
    <${stepperTag}>
        <${anchorStepTag} severity="error" href="#" severity-text="Error Description" style="width:150px">
            😀
            <div slot="title">Title</div>
            <div slot="subtitle">Subtitle</div>
        </${anchorStepTag}>
        <${stepTag} severity="error" severity-text="Error Description" style="width:150px">
            😀
            <div slot="title">Title</div>
            <div slot="subtitle">Subtitle</div></${stepTag}>
        </${stepperTag}>
    `),
    argTypes: {
        stepType: {
            name: 'default',
            description: 'Content to be displayed inside the stepper.',
            table: { category: apiCategory.slots },
            control: false
        }
    },
    args: {
        stepType: ExampleStepType.simple
    }
};

export default metadata;

export const stepper: StoryObj<StepperArgs> = {};

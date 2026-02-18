import { html, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { AnchorStepSeverity } from '@ni/nimble-components/dist/esm/anchor-step/types';
import { StepSeverity } from '@ni/nimble-components/dist/esm/step/types';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    // incubatingWarning
} from '../../utilities/storybook';
import { ExampleStepType } from './types';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

const metadata: Meta = {
    title: 'Incubating/Stepper',
    parameters: {
        actions: {}
    },
};
export default metadata;

const severityTextDescription = 'A message to be displayed explaining the current severity level of the control. Always visible when set with style based on control severity.';

interface AnchorStepArgs {
    href: string;
    disabled: boolean;
    severity: keyof typeof AnchorStepSeverity;
    severityText: string;
    title: string;
    subtitle: string;
}
export const anchorStep: StoryObj<AnchorStepArgs> = {
    render: createUserSelectedThemeStory(html`
        <${stepperTag}>
            <${anchorStepTag}
                severity="${x => AnchorStepSeverity[x.severity]}"
                href="${x => (x.href === '' ? undefined : x.href)}"
                severity-text="${x => x.severityText}"
                style="width:150px"
            >
                😀
                ${when(x => x.title, html<AnchorStepArgs>`<div slot="title">${x => x.title}</div>`)}
                ${when(x => x.subtitle, html<AnchorStepArgs>`<div slot="subtitle">${x => x.subtitle}</div>`)}
            </${anchorStepTag}>
        </${stepperTag}>
    `),
    argTypes: {
        href: {
            description: hrefDescription({
                componentName: 'anchor step',
                includeDisable: false
            }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({
                componentName: 'anchor step'
            }),
            table: { category: apiCategory.attributes }
        },
        severity: {
            options: Object.keys(AnchorStepSeverity),
            control: { type: 'radio' },
            description: 'Severity of the step',
            table: { category: apiCategory.attributes }
        },
        severityText: {
            description: severityTextDescription,
            table: { category: apiCategory.attributes }
        },
        title: {
            description: 'step title',
            table: { category: apiCategory.slots }
        },
        subtitle: {
            description: 'step subtitle',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        href: 'https://nimble.ni.dev',
        disabled: false,
        severity: 'default',
        severityText: 'Helper message',
        title: 'Title',
        subtitle: 'Subtitle'
    }
};

interface StepArgs {
    disabled: boolean;
    severity: keyof typeof StepSeverity;
    severityText: string;
    title: string;
    subtitle: string;
}
export const step: StoryObj<StepArgs> = {
    render: createUserSelectedThemeStory(html`
        <${stepperTag}>
            <${stepTag}
                severity="${x => StepSeverity[x.severity]}"
                severity-text="${x => x.severityText}"
                style="width:150px"
            >
                😀
                ${when(x => x.title, html<StepArgs>`<div slot="title">${x => x.title}</div>`)}
                ${when(x => x.subtitle, html<StepArgs>`<div slot="subtitle">${x => x.subtitle}</div>`)}
            </${stepTag}>
        </${stepperTag}>
    `),
    argTypes: {
        disabled: {
            description: disabledDescription({
                componentName: 'anchor step'
            }),
            table: { category: apiCategory.attributes }
        },
        severity: {
            options: Object.keys(StepSeverity),
            control: { type: 'radio' },
            description: 'Severity of the step',
            table: { category: apiCategory.attributes }
        },
        severityText: {
            description: severityTextDescription,
            table: { category: apiCategory.attributes }
        },
        title: {
            description: 'step title',
            table: { category: apiCategory.slots }
        },
        subtitle: {
            description: 'step subtitle',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        disabled: false,
        severity: 'default',
        severityText: 'Helper message',
        title: 'Title',
        subtitle: 'Subtitle'
    }
};

interface StepperArgs {
    stepType: ExampleStepType;
}

export const stepper: StoryObj<StepperArgs> = {
    render: createUserSelectedThemeStory(html`
    ${'' /* incubatingWarning({
        componentName: stepperTag,
        statusLink: 'https://github.com/ni/nimble/issues/624'
    }) */}
    <${stepperTag}>
        <${anchorStepTag} severity="success" href="#" severity-text="Error Description" style="width:150px">
            😀
            <div slot="title">Title</div>
            <div slot="subtitle">Subtitle</div>
        </${anchorStepTag}>
        <${stepTag} severity="success" severity-text="Error Description" style="width:150px">
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

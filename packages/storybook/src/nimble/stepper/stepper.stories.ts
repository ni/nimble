import { html, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { action } from 'storybook/actions';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { AnchorStepSeverity } from '@ni/nimble-components/dist/esm/anchor-step/types';
import { StepSeverity } from '@ni/nimble-components/dist/esm/step/types';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    incubatingWarning
} from '../../utilities/storybook';
import { ExampleStepType } from './types';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

const metadata: Meta = {
    title: 'Components/Stepper',
};
export default metadata;

const severityTextDescription = 'A message explaining the state of the step. Only visible when `severity` is set to `error` or `warning`.';

interface AnchorStepArgs {
    href: string;
    disabled: boolean;
    severity: keyof typeof AnchorStepSeverity;
    severityText: string;
    title: string;
    subtitle: string;
    selected: boolean;
}
export const anchorStep: StoryObj<AnchorStepArgs> = {
    render: createUserSelectedThemeStory(html`
        <${stepperTag}>
            <${anchorStepTag}
                href="${x => (x.href === '' ? undefined : x.href)}"
                target="${x => (x.href === '#' ? '_self' : undefined)}"
                ?disabled="${x => x.disabled}"
                severity="${x => AnchorStepSeverity[x.severity]}"
                severity-text="${x => x.severityText}"
                ?selected="${x => x.selected}"
            >
                1
                ${when(x => x.title, html<AnchorStepArgs>`<span slot="title">${x => x.title}</span>`)}
                ${when(x => x.subtitle, html<AnchorStepArgs>`<span slot="subtitle">${x => x.subtitle}</span>`)}
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
            description: 'Severity of the step.',
            table: { category: apiCategory.attributes }
        },
        severityText: {
            name: 'severity-text',
            description: severityTextDescription,
            table: { category: apiCategory.attributes }
        },
        title: {
            description: 'The step title.',
            table: { category: apiCategory.slots }
        },
        subtitle: {
            description: 'The step subtitle.',
            table: { category: apiCategory.slots }
        },
        selected: {
            description: 'Styles that indicate the control is selected.',
            table: { category: apiCategory.attributes }
        },
    },
    args: {
        href: '#',
        disabled: false,
        severity: 'default',
        severityText: 'Helper message',
        title: 'Title',
        subtitle: 'Subtitle',
        selected: false,
    }
};

interface StepArgs {
    disabled: boolean;
    severity: keyof typeof StepSeverity;
    severityText: string;
    title: string;
    subtitle: string;
    selected: boolean;
    click: undefined;
}
export const step: StoryObj<StepArgs> = {
    render: createUserSelectedThemeStory(html`
        <${stepperTag}>
            <${stepTag}
                ?disabled="${x => x.disabled}"
                severity="${x => StepSeverity[x.severity]}"
                severity-text="${x => x.severityText}"
                ?selected="${x => x.selected}"
                @click="${(_x, c) => action(c.event.type)({})}"
            >
                1
                ${when(x => x.title, html<StepArgs>`<span slot="title">${x => x.title}</span>`)}
                ${when(x => x.subtitle, html<StepArgs>`<span slot="subtitle">${x => x.subtitle}</span>`)}
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
            description: 'Severity of the step.',
            table: { category: apiCategory.attributes }
        },
        severityText: {
            name: 'severity-text',
            description: severityTextDescription,
            table: { category: apiCategory.attributes }
        },
        title: {
            description: 'The step title.',
            table: { category: apiCategory.slots }
        },
        subtitle: {
            description: 'The step subtitle.',
            table: { category: apiCategory.slots }
        },
        selected: {
            description: 'Styles that indicate the control is selected.',
            table: { category: apiCategory.attributes }
        },
        click: {
            description:
                'Event emitted when the button is activated by either keyboard or mouse.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        disabled: false,
        severity: 'default',
        severityText: 'Helper message',
        title: 'Title',
        subtitle: 'Subtitle',
        selected: false,
    }
};

interface StepperArgs {
    stepType: ExampleStepType;
}

export const stepper: StoryObj<StepperArgs> = {
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: stepperTag,
        statusLink: 'https://github.com/ni/nimble/issues/624'
    })}
    <${stepperTag}>
        <${anchorStepTag}
            severity="success"
            href="#"
            target="_self"
            severity-text="Error Description"
        >
            1
            <span slot="title">Title</span>
            <span slot="subtitle">Subtitle</span>
        </${anchorStepTag}>
        <${stepTag}
            severity="error"
            severity-text="Error Description"
        >
            1
            <span slot="title">Title</span>
            <span slot="subtitle">Subtitle</span>
        </${stepTag}>
    </${stepperTag}>
    `),
    argTypes: {
        stepType: {
            name: 'step',
            description: `Add child \`${stepTag}\` or \`${anchorStepTag}\` components. The components will target the \`step\` slot by default.`,
            table: { category: apiCategory.slots },
            control: false
        }
    },
    args: {
        stepType: ExampleStepType.simple
    }
};

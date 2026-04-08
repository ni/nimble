import { html, repeat, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { action } from 'storybook/actions';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { AnchorStepSeverity } from '@ni/nimble-components/dist/esm/anchor-step/types';
import { StepSeverity } from '@ni/nimble-components/dist/esm/step/types';
import { StepperOrientation } from '@ni/nimble-components/dist/esm/stepper/types';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    incubatingWarning,
    readonlyDescription
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
    readonly: boolean;
    severity: keyof typeof AnchorStepSeverity;
    severityText: string;
    title: string;
    subtitle: string;
    selected: boolean;
    stepIndicator: undefined;
}
export const anchorStep: StoryObj<AnchorStepArgs> = {
    render: createUserSelectedThemeStory(html`
        <${stepperTag} class="code-hide-top-container">
            <${anchorStepTag}
                ?disabled="${x => x.disabled}"
                ?readonly="${x => x.readonly}"
                severity="${x => AnchorStepSeverity[x.severity]}"
                severity-text="${x => x.severityText}"
                ?selected="${x => x.selected}"
                href="${x => (x.href === '' ? undefined : x.href)}"
                target="${x => (x.href === '#' ? '_self' : undefined)}"
            >
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
        readonly: {
            description: readonlyDescription({ componentName: 'anchor step' }),
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
        stepIndicator: {
            name: 'step-indicator',
            description: 'Override the step number text shown in the default severity. Generally should be unused, reach out to nimble design system if needed.',
            table: { category: apiCategory.slots },
            control: false
        },
    },
    args: {
        href: '#',
        disabled: false,
        readonly: false,
        severity: 'default',
        severityText: 'Helper message',
        title: 'Title',
        subtitle: 'Subtitle',
        selected: false,
    }
};

interface StepArgs {
    disabled: boolean;
    readonly: boolean;
    severity: keyof typeof StepSeverity;
    severityText: string;
    title: string;
    subtitle: string;
    selected: boolean;
    click: undefined;
    stepIndicator: undefined;
}
export const step: StoryObj<StepArgs> = {
    render: createUserSelectedThemeStory(html`
        <${stepperTag} class="code-hide-top-container">
            <${stepTag}
                ?disabled="${x => x.disabled}"
                ?readonly="${x => x.readonly}"
                severity="${x => StepSeverity[x.severity]}"
                severity-text="${x => x.severityText}"
                ?selected="${x => x.selected}"
                @click="${(_x, c) => {
                    action(c.event.type)({});
                }}"
            >
                ${when(x => x.title, html<StepArgs>`<span slot="title">${x => x.title}</span>`)}
                ${when(x => x.subtitle, html<StepArgs>`<span slot="subtitle">${x => x.subtitle}</span>`)}
            </${stepTag}>
        </${stepperTag}>
    `),
    argTypes: {
        disabled: {
            description: disabledDescription({
                componentName: 'step'
            }),
            table: { category: apiCategory.attributes }
        },
        readonly: {
            description: readonlyDescription({ componentName: 'anchor step' }),
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
        },
        stepIndicator: {
            name: 'step-indicator',
            description: 'Override the step number text shown in the default severity. Generally should be unused, reach out to nimble design system if needed.',
            table: { category: apiCategory.slots },
            control: false
        },
    },
    args: {
        disabled: false,
        readonly: false,
        severity: 'default',
        severityText: 'Helper message',
        title: 'Title',
        subtitle: 'Subtitle',
        selected: false,
    }
};

interface StepSetItem {
    title: string;
    subtitle: string;
    severityText?: string;
    severity?: StepSeverity;
    disabled?: boolean;
    selected?: boolean;
}

const simple: readonly StepSetItem[] = [
    { title: 'Check Moe', subtitle: 'Lost his bar' },
    { title: 'Check Barney', subtitle: 'Lost Moe\'s bar' },
    { title: 'Check Skinner', subtitle: 'Lost his oil well' },
    { title: 'Check Willie', subtitle: 'No crystal slop bucket' },
    { title: 'Check Maggie', subtitle: 'Just an innocent baby' },
    { title: 'Share results', subtitle: 'Reveal who is responsible' },
];

const severity: readonly StepSetItem[] = [
    { title: 'Check Moe', subtitle: 'Lost his bar' },
    { title: 'Check Barney', subtitle: 'Lost Moe\'s bar', severityText: 'Something smells funny', severity: StepSeverity.error },
    { title: 'Check Skinner', subtitle: 'Lost his oil well', severityText: 'Too many drillers', severity: StepSeverity.warning },
    { title: 'Check Willie', subtitle: 'No crystal slop bucket', severity: StepSeverity.success },
    { title: 'Check Maggie', subtitle: 'Just an innocent baby', disabled: true },
    { title: 'Share results', subtitle: 'Reveal who is responsible', selected: true },
];

const many = Array.from({ length: 20 }).map((_x, i, arr) => ({
    title: `Step ${i + 1}`,
    subtitle: `On step ${i + 1} of ${arr.length}`,
}));

const wide = [
    {
        title: 'Step 1 that is too long and should probably be shorter but is not and sometimes you have to pick which battles to fight and which to let go of',
        subtitle: 'On step 1 of 3'
    },
    {
        title: 'Page 2 that is also long but not too long',
        subtitle: 'On step 2 of 3',
    },
    {
        title: 'Short',
        subtitle: 'On step 3 of 3',
    }
] as const;

const stepSets: { [key in ExampleStepType]: readonly StepSetItem[] } = {
    [ExampleStepType.simple]: simple,
    [ExampleStepType.severity]: severity,
    [ExampleStepType.many]: many,
    [ExampleStepType.wide]: wide,
};
type StepSet = StepSetItem;

interface StepperArgs {
    stepType: ExampleStepType;
    orientation: StepperOrientation;
}

export const stepper: StoryObj<StepperArgs> = {
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: stepperTag,
        statusLink: 'https://github.com/ni/nimble/issues/624'
    })}
    <style class="code-hide">
        ${stepperTag} {
            max-width: 100%;
            max-height: 500px;
        }
    </style>
    <${stepperTag}
        orientation="${x => x.orientation}"
    >
        ${repeat(x => stepSets[x.stepType], html<StepSet>`
            <${stepTag}
                severity="${x => x.severity}"
                severity-text="${x => x.severityText}"
                ?disabled="${x => x.disabled}"
                ?selected="${x => x.selected}"
            >
                <span slot="title">${x => x.title}</span>
                <span slot="subtitle">${x => x.subtitle}</span>
            </${stepTag}>
        `)}
    </${stepperTag}>
    `),
    argTypes: {
        stepType: {
            name: 'step',
            description: `Add child \`${stepTag}\` or \`${anchorStepTag}\` components. The components will target the \`step\` slot by default.`,
            table: { category: apiCategory.slots },
            options: Object.keys(ExampleStepType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleStepType.simple]: 'Simple default step items',
                    [ExampleStepType.severity]: 'Steps with various severities',
                    [ExampleStepType.many]: 'Many steps',
                    [ExampleStepType.wide]: 'Wide steps',
                }
            },
        },
        orientation: {
            options: Object.values(StepperOrientation),
            control: {
                type: 'radio'
            },
            description: 'The orientation of the steps.',
            table: { category: apiCategory.attributes }
        },
    },
    args: {
        stepType: ExampleStepType.simple,
        orientation: StepperOrientation.horizontal,
    }
};

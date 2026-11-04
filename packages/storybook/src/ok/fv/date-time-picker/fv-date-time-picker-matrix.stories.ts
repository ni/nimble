import type { Meta, StoryFn } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { type FvDateTimePicker, fvDateTimePickerTag } from '@ni/ok-components/dist/esm/fv/date-time-picker';
import { FvDateTimePickerAppearance } from '@ni/ok-components/dist/esm/fv/date-time-picker/types';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { lang } from '@ni/nimble-components/dist/esm/theme-provider';
import { createMatrix, createMatrixInteractions, createMatrixThemeStory, sharedMatrixParameters } from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Date Time Picker',
    parameters: { ...sharedMatrixParameters() }
};

export default metadata;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        (appearance: FvDateTimePickerAppearance, state: string) => html`
            <${fvDateTimePickerTag}
                style="display: block; width: 320px; margin: 16px;"
                appearance="${() => appearance}"
                value="${() => (state === 'Empty' ? '' : '2024-11-13T14:25')}"
                ?disabled="${() => state === 'Disabled'}"
                ?readonly="${() => state === 'Read only'}"
                ?required-visible="${() => state === 'Required'}"
                ?error-visible="${() => state === 'Error'}"
                error-text="Enter a valid date and time."
            >${() => `${appearance}: ${state}`}</${fvDateTimePickerTag}>
        `,
        [Object.values(FvDateTimePickerAppearance), ['Selected', 'Empty', 'Disabled', 'Read only', 'Required', 'Error']]
    )
);

export const triggerInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractions(
        (appearance: FvDateTimePickerAppearance) => html`
            <${fvDateTimePickerTag}
                style="display: block; width: 320px; margin: 16px;"
                appearance="${() => appearance}"
                value="2024-11-13T14:25"
            >${() => appearance}</${fvDateTimePickerTag}>
        `,
        [Object.values(FvDateTimePickerAppearance)]
    )
);

interface PopupScenario {
    name: string;
    interaction?: string;
    type?: 'date' | 'datetime-local';
    locale?: string;
    min?: string;
    max?: string;
    step?: string;
}

const popupScenarios: PopupScenario[] = [
    { name: 'Default' },
    { name: 'Hover', interaction: 'pseudo-hover-all' },
    { name: 'Pressed', interaction: 'pseudo-hover-all pseudo-active-all' },
    { name: 'Focus', interaction: 'pseudo-focus-visible-all' },
    { name: 'Date only', type: 'date' },
    { name: 'German', locale: 'de-DE' },
    { name: 'Constraints', min: '2024-11-10T09:00', max: '2024-11-20T17:00', step: '900' }
];

export const popupThemeMatrix: StoryFn = createMatrixThemeStory(createMatrix(
    (scenario: PopupScenario) => html`
        <div inert data-locale="${() => scenario.locale ?? 'en-US'}"
            class="${() => scenario.interaction ?? ''}" style="display: inline-block; vertical-align: top; padding: 16px; width: 400px; height: 540px;">
            <${fvDateTimePickerTag} style="width: 320px;"
                type="${() => scenario.type ?? 'datetime-local'}"
                value="${() => (scenario.type === 'date' ? '2024-11-13' : '2024-11-13T14:30')}"
                min="${() => scenario.min ?? ''}" max="${() => scenario.max ?? ''}" step="${() => scenario.step ?? ''}" open>
                ${() => scenario.name}
            </${fvDateTimePickerTag}>
        </div>
    `,
    [popupScenarios]
));

popupThemeMatrix.play = async ({ canvasElement }) => {
    await waitForUpdatesAsync();
    const pickers = canvasElement.querySelectorAll<FvDateTimePicker>(fvDateTimePickerTag);
    await Promise.all(Array.from(pickers, async picker => {
        lang.setValueFor(picker, picker.parentElement!.dataset.locale!);
        const region = picker.region!;
        if (!region.classList.contains('loaded')) {
            await new Promise<void>(resolve => {
                region.addEventListener('loaded', () => resolve(), { once: true });
            });
        }
        // Keep the visual reference date stable instead of changing snapshots daily.
        picker.shadowRoot!.querySelector('[data-date="2024-11-14"]')!.setAttribute('aria-current', 'date');
    }));
};

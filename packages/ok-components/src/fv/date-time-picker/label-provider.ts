import { attr } from '@ni/fast-element';
import { DesignSystem, DesignToken } from '@ni/fast-foundation';
import { LabelProviderBase, type DesignTokensFor } from '@ni/nimble-components/dist/esm/label-provider/base';
import { styles } from '@ni/nimble-components/dist/esm/label-provider/base/styles';

const label = (name: string, value: string): DesignToken<string> => DesignToken.create<string>({
    name: `ok-fv-date-time-picker-${name}`,
    cssCustomPropertyName: null
}).withDefault(value);

export const labels = {
    chooseDate: label('choose-date', 'Choose date'),
    chooseDateTime: label('choose-date-time', 'Choose date and time'),
    month: label('month', 'Month'),
    year: label('year', 'Year'),
    previousMonth: label('previous-month', 'Previous month'),
    nextMonth: label('next-month', 'Next month'),
    time: label('time', 'Time'),
    done: label('done', 'Done'),
    invalidDate: label('invalid-date', 'Enter a valid date.'),
    invalidDateTime: label('invalid-date-time', 'Enter a valid date and time.'),
    invalidTime: label('invalid-time', 'Enter a valid time.')
} as const;

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-date-time-picker-label-provider': FvDateTimePickerLabelProvider;
    }
}

/**
 * Translatable labels for the experimental date/time picker.
 */
export class FvDateTimePickerLabelProvider extends LabelProviderBase<typeof labels>
    implements DesignTokensFor<typeof labels> {
    @attr({ attribute: 'choose-date' })
    public chooseDate: string | undefined;

    @attr({ attribute: 'choose-date-time' })
    public chooseDateTime: string | undefined;

    @attr
    public month: string | undefined;

    @attr
    public year: string | undefined;

    @attr({ attribute: 'previous-month' })
    public previousMonth: string | undefined;

    @attr({ attribute: 'next-month' })
    public nextMonth: string | undefined;

    @attr
    public time: string | undefined;

    @attr
    public done: string | undefined;

    @attr({ attribute: 'invalid-date' })
    public invalidDate: string | undefined;

    @attr({ attribute: 'invalid-date-time' })
    public invalidDateTime: string | undefined;

    @attr({ attribute: 'invalid-time' })
    public invalidTime: string | undefined;

    protected override readonly supportedLabels = labels;
}

const provider = FvDateTimePickerLabelProvider.compose({
    baseName: 'fv-date-time-picker-label-provider',
    styles
});
DesignSystem.getOrCreate().withPrefix('ok').register(provider());
export const fvDateTimePickerLabelProviderTag = 'ok-fv-date-time-picker-label-provider';

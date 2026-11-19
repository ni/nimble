import type { ComponentProps } from 'react';
import type { OkFvMultiSelect } from '../src/fv/multi-select';
import type { OkFvTextField } from '../src/fv/text-field';
import type { OkFvDateTimePicker } from '../src/fv/date-time-picker';
import type { OkFvSplitLayout } from '../src/fv/split-layout';

const multiInput: NonNullable<ComponentProps<typeof OkFvMultiSelect>['onInput']> = event => {
    const value: string[] = event.target.selectedValues; return value;
};
const multiChange: NonNullable<ComponentProps<typeof OkFvMultiSelect>['onChange']> = event => {
    const value: string[] = event.target.selectedValues; return value;
};
const textInput: NonNullable<ComponentProps<typeof OkFvTextField>['onInput']> = event => {
    const value: string = event.target.value; return value;
};
const textChange: NonNullable<ComponentProps<typeof OkFvTextField>['onChange']> = event => {
    const value: string = event.target.value; return value;
};
const dateInput: NonNullable<ComponentProps<typeof OkFvDateTimePicker>['onInput']> = event => {
    const value: string = event.target.value; return value;
};
const dateChange: NonNullable<ComponentProps<typeof OkFvDateTimePicker>['onChange']> = event => {
    const value: string = event.target.value; return value;
};
const layoutInput: NonNullable<ComponentProps<typeof OkFvSplitLayout>['onInput']> = event => {
    const value: number = event.target.position; return value;
};
const layoutChange: NonNullable<ComponentProps<typeof OkFvSplitLayout>['onChange']> = event => {
    const value: number = event.target.position; return value;
};

export { multiInput, multiChange, textInput, textChange, dateInput, dateChange, layoutInput, layoutChange };

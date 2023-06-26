import { DesignToken } from '@microsoft/fast-foundation';
import { coreLabelDefaults } from './label-token-defaults';

export const alertDismissLabel = DesignToken.create<string>({
    name: 'alert-dismiss-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.alertDismissLabel);

export const numberFieldDecrementLabel = DesignToken.create<string>({
    name: 'number-field-decrement-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.numberFieldDecrementLabel);

export const numberFieldIncrementLabel = DesignToken.create<string>({
    name: 'number-field-increment-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.numberFieldIncrementLabel);

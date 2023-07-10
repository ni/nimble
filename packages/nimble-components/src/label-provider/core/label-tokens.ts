import { DesignToken } from '@microsoft/fast-foundation';
import { coreLabelDefaults } from './label-token-defaults';

export const popupDismissLabel = DesignToken.create<string>({
    name: 'popup-dismiss-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.popupDismissLabel);

export const numericDecrementLabel = DesignToken.create<string>({
    name: 'numeric-decrement-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.numericDecrementLabel);

export const numericIncrementLabel = DesignToken.create<string>({
    name: 'numeric-increment-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.numericIncrementLabel);

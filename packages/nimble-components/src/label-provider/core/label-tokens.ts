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

export const errorIconLabel = DesignToken.create<string>({
    name: 'error-icon-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.errorIconLabel);

export const warningIconLabel = DesignToken.create<string>({
    name: 'warning-icon-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.warningIconLabel);

export const informationIconLabel = DesignToken.create<string>({
    name: 'information-icon-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.informationIconLabel);

export const selectFilterSearchLabel = DesignToken.create<string>({
    name: 'select-filter-search-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.selectFilterSearchLabel);

export const selectFilterNoResultsLabel = DesignToken.create<string>({
    name: 'select-filter-no-results-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.selectFilterNoResultsLabel);

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

export const popupIconErrorLabel = DesignToken.create<string>({
    name: 'popup-icon-error-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.popupIconErrorLabel);

export const popupIconWarningLabel = DesignToken.create<string>({
    name: 'popup-icon-warning-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.popupIconWarningLabel);

export const popupIconInformationLabel = DesignToken.create<string>({
    name: 'popup-icon-information-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.popupIconInformationLabel);

export const filterSearchLabel = DesignToken.create<string>({
    name: 'filter-search-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.filterSearchLabel);

export const filterNoResultsLabel = DesignToken.create<string>({
    name: 'filter-no-results-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.filterNoResultsLabel);

export const loadingLabel = DesignToken.create<string>({
    name: 'loading-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.loadingLabel);

export const scrollBackwardLabel = DesignToken.create<string>({
    name: 'scroll-backward-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.scrollBackwardLabel);

export const scrollForwardLabel = DesignToken.create<string>({
    name: 'scroll-right-button-label',
    cssCustomPropertyName: null
}).withDefault(coreLabelDefaults.scrollForwardLabel);

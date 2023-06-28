import type { ViewTemplate } from '@microsoft/fast-element';
import type { MappingConfig } from '../base/types';

export interface MappingConfigIconBase extends MappingConfig {
    label: string;
    viewTemplate: ViewTemplate;
}

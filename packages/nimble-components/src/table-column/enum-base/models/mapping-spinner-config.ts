import { MappingConfig } from './mapping-config';

/**
 * Mapping configuration corresponding to a text mapping
 */
export class MappingSpinnerConfig extends MappingConfig {
    public constructor(public readonly label: string) {
        super();
    }
}

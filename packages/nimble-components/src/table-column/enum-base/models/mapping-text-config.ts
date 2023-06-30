import { MappingConfig } from './mapping-config';

/**
 * Mapping configuration corresponding to a text mapping
 */
export class MappingTextConfig extends MappingConfig {
    public constructor(public readonly label: string) {
        super();
    }
}

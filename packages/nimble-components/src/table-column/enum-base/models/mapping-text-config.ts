import type { MappingText } from '../../../mapping/text';
import { MappingConfig } from './mapping-config';

/**
 * Mapping configuration corresponding to a text mapping
 */
export class MappingTextConfig extends MappingConfig {
    public constructor(
        public label: string
    ) {
        super();
    }

    public static from(mapping: MappingText): MappingTextConfig {
        return new MappingTextConfig(mapping.label ?? '');
    }
}

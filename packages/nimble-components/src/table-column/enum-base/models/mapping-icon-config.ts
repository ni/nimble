import type { IconSeverity } from '../../../icon-base/types';
import { MappingConfig } from './mapping-config';

/**
 * Mapping configuration corresponding to a text mapping
 */
export class MappingIconConfig extends MappingConfig {
    public constructor(
        public readonly label: string,
        public readonly severity: IconSeverity,
        public readonly resolvedIcon: string
    ) {
        super();
    }
}

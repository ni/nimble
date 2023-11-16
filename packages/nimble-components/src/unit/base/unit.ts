import { FoundationElement } from '@microsoft/fast-foundation';
import type { UnitScale } from '../../table-column/number-text/models/unit-scale';

/**
 * An element representing a set of related units which could be used to represent the same value
 */
export abstract class Unit extends FoundationElement {
    public abstract getUnitScale(): UnitScale;
}

import { FoundationElement } from '@microsoft/fast-foundation';
import type { UnitScale } from '../../utilities/number-formatter/unit-scale/base/unit-scale';

/**
 * An element representing a set of related units which could be used to represent the same value
 */
export abstract class Unit extends FoundationElement {
    public abstract getUnitScale(): UnitScale;
}

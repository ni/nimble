import { observable } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import type { UnitScale } from '@ni/unit-format/unit-scale/unit-scale';

/**
 * The base class for an element that provides a unit scale for scaled unit conversions
 */
export abstract class Unit extends FoundationElement {
    /** @internal */
    @observable
    public resolvedUnitScale?: UnitScale;
}

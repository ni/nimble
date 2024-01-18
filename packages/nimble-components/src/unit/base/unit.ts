import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { UnitScale } from '../../utilities/unit-format/unit-scale/unit-scale';

/**
 * The base class for an element that provides a unit scale for scaled unit conversions
 */
export abstract class Unit extends FoundationElement {
    /** @internal */
    @observable
    public resolvedUnitScale?: UnitScale;
}

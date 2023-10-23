import { FoundationElement } from '@microsoft/fast-foundation';
import type { UnitScaleFormatterContructor } from '../../table-column/number-text/models/unit-scale-formatter';

/**
 * An element representing a set of related units which could be used to represent the same value
 */
export abstract class UnitScale extends FoundationElement {
    public abstract getFormatter(): UnitScaleFormatterContructor;
}

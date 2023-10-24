import { FoundationElement } from '@microsoft/fast-foundation';
import type { UnitScaleFormatterConstructor } from '../../table-column/number-text/models/unit-scale-formatter';

/**
 * An element representing a set of related units which could be used to represent the same value
 */
export abstract class UnitScale extends FoundationElement {
    public abstract getFormatter(): UnitScaleFormatterConstructor;
}

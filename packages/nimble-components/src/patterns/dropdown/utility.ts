import type { AnchoredRegionPositionLabel } from '@ni/fast-foundation';
import { DropdownPosition } from './types';

export function anchoredRegionPositionToDropdownPosition(
    anchoredRegionPosition?: AnchoredRegionPositionLabel
): DropdownPosition {
    return anchoredRegionPosition === 'start'
        ? DropdownPosition.above
        : DropdownPosition.below;
}

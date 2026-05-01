/* eslint-disable no-alert */
import { Component } from '@angular/core';

@Component({
    selector: 'example-chip-section',
    template: `
        <example-sub-container label="Chip">
            <nimble-chip>Outline Chip</nimble-chip>
            <nimble-chip appearance="block">Block Chip</nimble-chip>
            <nimble-chip selectable [selected]="chipSelected" (selected-change)="onChipSelectedChange()">
                Selectable Chip
            </nimble-chip>
            <nimble-chip removable (remove)="onChipRemove()">Removable Chip</nimble-chip>
            <nimble-chip disabled>Disabled Chip</nimble-chip>
        </example-sub-container>
    `,
    standalone: false
})
export class ChipSectionComponent {
    public chipSelected = false;

    public onChipSelectedChange(): void {
        this.chipSelected = !this.chipSelected;
    }

    public onChipRemove(): void {
        alert('Chip removed');
    }
}

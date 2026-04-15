import { Component, ViewChild } from '@angular/core';
import { NimbleDialogDirective, UserDismissed } from '@ni/nimble-angular';

@Component({
    selector: 'example-dialog-section',
    template: `
        <example-sub-container label="Dialog">
            <nimble-dialog #dialog>
                <span slot="title">This is a dialog</span>
                <div>It opened when you pushed the button</div>
                <nimble-button slot="footer" (click)="closeDialog('cancel pressed')">Cancel</nimble-button>
                <nimble-button slot="footer" (click)="closeDialog('OK pressed')">OK</nimble-button>
            </nimble-dialog>
            <nimble-button (click)="openDialog()">Open Dialog</nimble-button>
            <nimble-text-field readonly [ngModel]="dialogCloseReason">Closed Reason</nimble-text-field>
        </example-sub-container>
    `,
    standalone: false
})
export class DialogSectionComponent {
    public dialogCloseReason = '';

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;

    public async openDialog(): Promise<void> {
        const closeReason = await this.dialog.show();
        this.dialogCloseReason = (closeReason === UserDismissed) ? 'escape pressed' : closeReason;
    }

    public closeDialog(reason: string): void {
        this.dialog.close(reason);
    }
}

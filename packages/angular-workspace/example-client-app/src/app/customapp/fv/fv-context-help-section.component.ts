import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-context-help-section',
    template: `
        <example-sub-container label="Fv Context Help (Ok)">
            <div>
                Support code
                <ok-fv-context-help
                    text="Use the value shown on the device label when the field is unavailable."
                    trigger-label="Show help for the support code"
                ></ok-fv-context-help>
            </div>
        </example-sub-container>
    `,
    standalone: false
})
export class FvContextHelpSectionComponent {}
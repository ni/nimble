import { Component } from '@angular/core';
import type { TableRecord } from '@ni/nimble-angular';

interface SimpleTableRecord extends TableRecord {
    stringValue1: string;
    stringValue2: string;
}

@Component({
    selector: 'example-tabledemo',
    templateUrl: './tabledemo.component.html',
    styleUrls: ['./tabledemo.component.scss']
})
export class TableDemoComponent {
    public tableData: SimpleTableRecord[] = Array.from(Array(1000), (_, i) => {
        return {
            stringValue1: `Row  ${(i + 1)}`,
            stringValue2: 'Example Text'
        };
    });
}

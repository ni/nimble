import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnSortDirection } from '@ni/nimble-angular/table-column';
import { actionMenuLabel1, actionMenuSlot1, columnBaseProperties, columnHidden1, columnId1, fractionalWidthValue1, groupIndexValue1, groupableColumnProperties, groupingDisabledValue1, minPixelWidthValue1, placeholder1, placeholderProperties, sortDirection1, sortIndex1, sortableColumnProperties, sortingDisabled1 } from '@ni/nimble-angular/table-column/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { NimbleTableColumnAnchorDirective, TableColumnAnchor } from '../nimble-table-column-anchor.directive';
import { NimbleTableColumnAnchorModule } from '../nimble-table-column-anchor.module';

// TODO: Custom sort order

fdescribe('Nimble anchor table column', () => {
    const hreflang1 = 'en';
    const hreflang2 = 'fr';
    const ping1 = 'http://www.ni.com';
    const ping2 = 'http://www.ni.com http://www.google.com';
    const referrerpolicy1 = 'no-referrer';
    const referrerpolicy2 = 'origin';
    const rel1 = 'alternate';
    const rel2 = 'bookmark';
    const target1 = '_self';
    const target2 = '_blank';
    const type1 = 'text/plain';
    const type2 = 'application/javascript';
    const download1 = 'filename1.ext';
    const download2 = 'filename2.ext';
    const labelFieldName1 = 'label';
    const labelFieldName2 = 'foo';
    const hrefFieldName1 = 'href';
    const hrefFieldName2 = 'foo';
    const underlineHidden1 = true;
    const underlineHidden2 = false;

    class BaseTestHostComponent {
        public hreflang: string = hreflang1;
        public ping: string = ping1;
        public appearance: string | undefined = 'prominent';
        public underlineHidden: boolean = underlineHidden1;
    }

    type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

    interface TableColumnProperty<TColumnType> {
        name: string;
        property: keyof TColumnType;
        defaultValue: PropType<TColumnType, keyof TColumnType>;
        value1: PropType<TColumnType, keyof TColumnType> & PropType<BaseTestHostComponent, keyof BaseTestHostComponent>;
        value2: PropType<TColumnType, keyof TColumnType> & PropType<BaseTestHostComponent, keyof BaseTestHostComponent>;
    }

    const properties: TableColumnProperty<NimbleTableColumnAnchorDirective>[] = [
        { name: 'hreflang', property: 'hreflang', defaultValue: undefined, value1: hreflang1, value2: hreflang2 },
        { name: 'ping', property: 'ping', defaultValue: undefined, value1: ping1, value2: ping2 },
        { name: 'referrerpolicy', property: 'referrerpolicy', defaultValue: undefined, value1: referrerpolicy1, value2: referrerpolicy2 },
        { name: 'rel', property: 'rel', defaultValue: undefined, value1: rel1, value2: rel2 },
        { name: 'target', property: 'target', defaultValue: undefined, value1: target1, value2: target2 },
        { name: 'type', property: 'type', defaultValue: undefined, value1: type1, value2: type2 },
        { name: 'download', property: 'download', defaultValue: undefined, value1: download1, value2: download2 },
        { name: 'labelFieldName', property: 'labelFieldName', defaultValue: undefined, value1: labelFieldName1, value2: labelFieldName2 },
        { name: 'hrefFieldName', property: 'hrefFieldName', defaultValue: undefined, value1: hrefFieldName1, value2: hrefFieldName2 },
        { name: 'appearance', property: 'appearance', defaultValue: undefined, value1: 'prominent', value2: 'subtle' },
        { name: 'underlineHidden', property: 'underlineHidden', defaultValue: false, value1: underlineHidden1, value2: underlineHidden2 },
        ...columnBaseProperties,
        // ...placeholderProperties,
        // ...groupableColumnProperties,
        // ...sortableColumnProperties
    ] as const;

    // const properties = [
    //     { name: 'hreflang', property: 'hreflang', defaultValue: undefined, value1: hreflang1, value2: hreflang2 },
    //     { name: 'ping', property: 'ping', defaultValue: undefined, value1: ping1, value2: ping2 },
    //     { name: 'referrerpolicy', property: 'referrerpolicy', defaultValue: undefined, value1: referrerpolicy1, value2: referrerpolicy2 },
    //     { name: 'rel', property: 'rel', defaultValue: undefined, value1: rel1, value2: rel2 },
    //     { name: 'target', property: 'target', defaultValue: undefined, value1: target1, value2: target2 },
    //     { name: 'type', property: 'type', defaultValue: undefined, value1: type1, value2: type2 },
    //     { name: 'download', property: 'download', defaultValue: undefined, value1: download1, value2: download2 },
    //     { name: 'labelFieldName', property: 'labelFieldName', defaultValue: undefined, value1: labelFieldName1, value2: labelFieldName2 },
    //     { name: 'hrefFieldName', property: 'hrefFieldName', defaultValue: undefined, value1: hrefFieldName1, value2: hrefFieldName2 },
    //     { name: 'appearance', property: 'appearance', defaultValue: undefined, value1: 'prominent', value2: 'subtle' },
    //     { name: 'underlineHidden', property: 'underlineHidden', defaultValue: false, value1: underlineHidden1, value2: underlineHidden2 },
    //     ...columnBaseProperties,
    //     ...placeholderProperties,
    //     ...groupableColumnProperties,
    //     ...sortableColumnProperties
    //     // TODO: Custom sort order properties
    // ] as const;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTableColumnAnchorModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-table-column-anchor')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-table-column-anchor #column></nimble-table-column-anchor>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnAnchorDirective }) public directive: NimbleTableColumnAnchorDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnAnchor>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnAnchorDirective;
        let nativeElement: TableColumnAnchor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnAnchorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        parameterizeSpec(properties, (spec, name, value) => {
            spec(`has expected defaults for ${name}`, () => {
                expect(directive[value.property]).toBe(value.defaultValue);
                expect(nativeElement[value.property]).toBe(value.defaultValue);
            });
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table-column-anchor #column
                    hreflang="${hreflang1}"
                    ping="${ping1}"
                    appearance="prominent"
                    underline-hidden
                    >
                </nimble-table-column-anchor>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnAnchorDirective }) public directive: NimbleTableColumnAnchorDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnAnchor>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnAnchorDirective;
        let nativeElement: TableColumnAnchor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnAnchorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        parameterizeSpec(properties, (spec, name, value) => {
            spec(`will use template string values for ${name}`, () => {
                expect(directive[value.property]).toBe(value.value1);
                expect(nativeElement[value.property]).toBe(value.value1);
            });
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table-column-anchor #column
                    [hreflang]="hreflang"
                    [ping]="ping"
                    [appearance]="appearance"
                    [underline-hidden]="underlineHidden"
                    >
                    </nimble-table-column-anchor>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnAnchorDirective }) public directive: NimbleTableColumnAnchorDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnAnchor>;
            public hreflang: string = hreflang1;
            public ping: string = ping1;
            public referrerpolicy: string = referrerpolicy1;
            public rel: string = rel1;
            public target: string = target1;
            public type: string = type1;
            public download: string = download1;
            public labelFieldName: string = labelFieldName1;
            public hrefFieldName: string = hrefFieldName1;
            public appearance: string | undefined = 'prominent';
            public underlineHidden: boolean = underlineHidden1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnAnchorDirective;
        let nativeElement: TableColumnAnchor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnAnchorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        parameterizeSpec(properties, (spec, name, value) => {
            spec(`can be configured with property binding for ${name}`, () => {
                expect(directive[value.property]).toBe(value.value1);
                expect(nativeElement[value.property]).toBe(value.value1);

                // eslint-disable-next-line @typescript-eslint/dot-notation
                // fixture.componentInstance['underlineHidden'] = 'foo';
                fixture.componentInstance[value.property] = value.value2;
                fixture.detectChanges();

                expect(directive[value.property]).toBe(value.value2);
                expect(nativeElement[value.property]).toBe(value.value2);
            });
        });
    });

    // describe('with attribute bound values', () => {
    //     @Component({
    //         template: `
    //             <nimble-table-column-anchor #column
    //                 [attr.column-id]="columnId"
    //                 [attr.hreflang]="hreflang"
    //                 [attr.ping]="ping"
    //                 [attr.referrerpolicy]="referrerpolicy"
    //                 [attr.rel]="rel"
    //                 [attr.target]="target"
    //                 [attr.type]="type"
    //                 [attr.download]="download"
    //                 [attr.label-field-name]="labelFieldName"
    //                 [attr.href-field-name]="hrefFieldName"
    //                 [attr.appearance]="appearance"
    //                 [attr.underline-hidden]="underlineHidden"
    //                 [attr.action-menu-slot]="actionMenuSlot"
    //                 [attr.action-menu-label]="actionMenuLabel"
    //                 [attr.column-hidden]="columnHidden"
    //                 [attr.sort-direction]="sortDirection"
    //                 [attr.sort-index]="sortIndex"
    //                 [attr.sorting-disabled]="sortingDisabled"
    //                 [attr.sort-by-field-name]="sortByFieldName"
    //                 [attr.fractional-width]="fractionalWidth"
    //                 [attr.min-pixel-width]="minPixelWidth"
    //                 [attr.group-index]="groupIndex"
    //                 [attr.grouping-disabled]="groupingDisabled"
    //                 [attr.placeholder]="placeholder"
    //                 >
    //             </nimble-table-column-anchor>
    //         `
    //     })
    //     class TestHostComponent {
    //         @ViewChild('column', { read: NimbleTableColumnAnchorDirective }) public directive: NimbleTableColumnAnchorDirective;
    //         @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnAnchor>;
    //         public hreflang = hreflang1;
    //         public ping = ping1;
    //         public referrerpolicy = referrerpolicy1;
    //         public rel = rel1;
    //         public target = target1;
    //         public type = type1;
    //         public download = download1;
    //         public labelFieldName = 'label';
    //         public hrefFieldName = 'href';
    //         public appearance: string | undefined = 'prominent';
    //         public underlineHidden = true;
    //         public columnId = 'my-column';
    //         public columnHidden = true;
    //         public actionMenuSlot = 'my-slot';
    //         public actionMenuLabel = 'my menu';
    //         public sortDirection: TableColumnSortDirection = TableColumnSortDirection.ascending;
    //         public sortIndex: number | null = 0;
    //         public sortingDisabled = false;
    //         public sortByFieldName = 'field2';
    //         public fractionalWidth: number | null = 2;
    //         public minPixelWidth: number | null = 40;
    //         public groupIndex: number | null = 0;
    //         public groupingDisabled = false;
    //         public placeholder = 'Custom placeholder';
    //     }

    //     let fixture: ComponentFixture<TestHostComponent>;
    //     let directive: NimbleTableColumnAnchorDirective;
    //     let nativeElement: TableColumnAnchor;

    //     beforeEach(() => {
    //         TestBed.configureTestingModule({
    //             declarations: [TestHostComponent],
    //             imports: [NimbleTableColumnAnchorModule]
    //         });
    //         fixture = TestBed.createComponent(TestHostComponent);
    //         fixture.detectChanges();
    //         directive = fixture.componentInstance.directive;
    //         nativeElement = fixture.componentInstance.elementRef.nativeElement;
    //     });

    //     it('can be configured with attribute binding for hreflang', () => {
    //         expect(directive.hreflang).toBe(hreflang1);
    //         expect(nativeElement.hreflang).toBe(hreflang1);

    //         fixture.componentInstance.hreflang = hreflang2;
    //         fixture.detectChanges();

    //         expect(directive.hreflang).toBe(hreflang2);
    //         expect(nativeElement.hreflang).toBe(hreflang2);
    //     });

    //     it('can be configured with attribute binding for ping', () => {
    //         expect(directive.ping).toBe(ping1);
    //         expect(nativeElement.ping).toBe(ping1);

    //         fixture.componentInstance.ping = ping2;
    //         fixture.detectChanges();

    //         expect(directive.ping).toBe(ping2);
    //         expect(nativeElement.ping).toBe(ping2);
    //     });

    //     it('can be configured with attribute binding for referrerpolicy', () => {
    //         expect(directive.referrerpolicy).toBe(referrerpolicy1);
    //         expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);

    //         fixture.componentInstance.referrerpolicy = referrerpolicy2;
    //         fixture.detectChanges();

    //         expect(directive.referrerpolicy).toBe(referrerpolicy2);
    //         expect(nativeElement.referrerpolicy).toBe(referrerpolicy2);
    //     });

    //     it('can be configured with attribute binding for rel', () => {
    //         expect(directive.rel).toBe(rel1);
    //         expect(nativeElement.rel).toBe(rel1);

    //         fixture.componentInstance.rel = rel2;
    //         fixture.detectChanges();

    //         expect(directive.rel).toBe(rel2);
    //         expect(nativeElement.rel).toBe(rel2);
    //     });

    //     it('can be configured with attribute binding for target', () => {
    //         expect(directive.target).toBe(target1);
    //         expect(nativeElement.target).toBe(target1);

    //         fixture.componentInstance.target = target2;
    //         fixture.detectChanges();

    //         expect(directive.target).toBe(target2);
    //         expect(nativeElement.target).toBe(target2);
    //     });

    //     it('can be configured with attribute binding for type', () => {
    //         expect(directive.type).toBe(type1);
    //         expect(nativeElement.type).toBe(type1);

    //         fixture.componentInstance.type = type2;
    //         fixture.detectChanges();

    //         expect(directive.type).toBe(type2);
    //         expect(nativeElement.type).toBe(type2);
    //     });

    //     it('can be configured with attribute binding for download', () => {
    //         expect(directive.download).toBe(download1);
    //         expect(nativeElement.download).toBe(download1);

    //         fixture.componentInstance.download = download2;
    //         fixture.detectChanges();

    //         expect(directive.download).toBe(download2);
    //         expect(nativeElement.download).toBe(download2);
    //     });

    //     it('can be configured with attribute binding for labelFieldName', () => {
    //         expect(directive.labelFieldName).toBe('label');
    //         expect(nativeElement.labelFieldName).toBe('label');

    //         fixture.componentInstance.labelFieldName = 'foo';
    //         fixture.detectChanges();

    //         expect(directive.labelFieldName).toBe('foo');
    //         expect(nativeElement.labelFieldName).toBe('foo');
    //     });

    //     it('can be configured with attribute binding for hrefFieldName', () => {
    //         expect(directive.hrefFieldName).toBe('href');
    //         expect(nativeElement.hrefFieldName).toBe('href');

    //         fixture.componentInstance.hrefFieldName = 'foo';
    //         fixture.detectChanges();

    //         expect(directive.hrefFieldName).toBe('foo');
    //         expect(nativeElement.hrefFieldName).toBe('foo');
    //     });

    //     it('can be configured with attribute binding for appearance', () => {
    //         expect(directive.appearance).toBe('prominent');
    //         expect(nativeElement.appearance).toBe('prominent');

    //         fixture.componentInstance.appearance = undefined;
    //         fixture.detectChanges();

    //         expect(directive.appearance).toBeNull();
    //         expect(nativeElement.appearance).toBeNull();
    //     });

    //     it('can be configured with attribute binding for underlineHidden', () => {
    //         expect(directive.underlineHidden).toBeTrue();
    //         expect(nativeElement.underlineHidden).toBeTrue();

    //         fixture.componentInstance.underlineHidden = false;
    //         fixture.detectChanges();

    //         expect(directive.underlineHidden).toBeFalse();
    //         expect(nativeElement.underlineHidden).toBeFalse();
    //     });

    //     it('can be configured with attribute binding for actionMenuSlot', () => {
    //         expect(directive.actionMenuSlot).toBe('my-slot');
    //         expect(nativeElement.actionMenuSlot).toBe('my-slot');

    //         fixture.componentInstance.actionMenuSlot = 'new-slot';
    //         fixture.detectChanges();

    //         expect(directive.actionMenuSlot).toBe('new-slot');
    //         expect(nativeElement.actionMenuSlot).toBe('new-slot');
    //     });

    //     it('can be configured with attribute binding for actionMenuLabel', () => {
    //         expect(directive.actionMenuLabel).toBe('my menu');
    //         expect(nativeElement.actionMenuLabel).toBe('my menu');

    //         fixture.componentInstance.actionMenuLabel = 'another menu';
    //         fixture.detectChanges();

    //         expect(directive.actionMenuLabel).toBe('another menu');
    //         expect(nativeElement.actionMenuLabel).toBe('another menu');
    //     });

    //     it('can be configured with attribute binding for columnId', () => {
    //         expect(directive.columnId).toBe('my-column');
    //         expect(nativeElement.columnId).toBe('my-column');

    //         fixture.componentInstance.columnId = 'new-column';
    //         fixture.detectChanges();

    //         expect(directive.columnId).toBe('new-column');
    //         expect(nativeElement.columnId).toBe('new-column');
    //     });

    //     it('can be configured with attribute binding for columnHidden', () => {
    //         expect(directive.columnHidden).toBe(true);
    //         expect(nativeElement.columnHidden).toBe(true);

    //         fixture.componentInstance.columnHidden = false;
    //         fixture.detectChanges();

    //         expect(directive.columnHidden).toBe(false);
    //         expect(nativeElement.columnHidden).toBe(false);
    //     });

    //     it('can be configured with attribute binding for sortDirection', () => {
    //         expect(directive.sortDirection).toBe(TableColumnSortDirection.ascending);
    //         expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.ascending);

    //         fixture.componentInstance.sortDirection = TableColumnSortDirection.descending;
    //         fixture.detectChanges();

    //         expect(directive.sortDirection).toBe(TableColumnSortDirection.descending);
    //         expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.descending);
    //     });

    //     it('can be configured with attribute binding for sortIndex', () => {
    //         expect(directive.sortIndex).toBe(0);
    //         expect(nativeElement.sortIndex).toBe(0);

    //         fixture.componentInstance.sortIndex = 1;
    //         fixture.detectChanges();

    //         expect(directive.sortIndex).toBe(1);
    //         expect(nativeElement.sortIndex).toBe(1);
    //     });

    //     it('can be configured with attribute binding for sortIndex updated to null', () => {
    //         expect(directive.sortIndex).toBe(0);
    //         expect(nativeElement.sortIndex).toBe(0);

    //         fixture.componentInstance.sortIndex = null;
    //         fixture.detectChanges();

    //         expect(directive.sortIndex).toBe(null);
    //         expect(nativeElement.sortIndex).toBe(null);
    //     });

    //     it('can be configured with attribute binding for sortingDisabled', () => {
    //         expect(directive.sortingDisabled).toBeFalse();
    //         expect(nativeElement.sortingDisabled).toBeFalse();

    //         fixture.componentInstance.sortingDisabled = true;
    //         fixture.detectChanges();

    //         expect(directive.sortingDisabled).toBeTrue();
    //         expect(nativeElement.sortingDisabled).toBeTrue();
    //     });

    //     it('can be configured with attribute binding for sortByFieldName', () => {
    //         expect(directive.sortByFieldName).toBe('field2');
    //         expect(nativeElement.sortByFieldName).toBe('field2');

    //         fixture.componentInstance.sortByFieldName = 'anotherField';
    //         fixture.detectChanges();

    //         expect(directive.sortByFieldName).toBe('anotherField');
    //         expect(nativeElement.sortByFieldName).toBe('anotherField');
    //     });

    //     it('can be configured with attribute binding for fractionalWidth', () => {
    //         expect(directive.fractionalWidth).toBe(2);
    //         expect(nativeElement.fractionalWidth).toBe(2);

    //         fixture.componentInstance.fractionalWidth = 1;
    //         fixture.detectChanges();

    //         expect(directive.fractionalWidth).toBe(1);
    //         expect(nativeElement.fractionalWidth).toBe(1);
    //     });

    //     it('can be configured with attribute binding for fractionalWidth set to null', () => {
    //         expect(directive.fractionalWidth).toBe(2);
    //         expect(nativeElement.fractionalWidth).toBe(2);

    //         fixture.componentInstance.fractionalWidth = null;
    //         fixture.detectChanges();

    //         expect(directive.fractionalWidth).toBe(null);
    //         expect(nativeElement.fractionalWidth).toBe(null);
    //     });

    //     it('can be configured with attribute binding for minPixelWidth', () => {
    //         expect(directive.minPixelWidth).toBe(40);
    //         expect(nativeElement.minPixelWidth).toBe(40);

    //         fixture.componentInstance.minPixelWidth = 50;
    //         fixture.detectChanges();

    //         expect(directive.minPixelWidth).toBe(50);
    //         expect(nativeElement.minPixelWidth).toBe(50);
    //     });

    //     it('can be configured with attribute binding for minPixelWidth set to null', () => {
    //         expect(directive.minPixelWidth).toBe(40);
    //         expect(nativeElement.minPixelWidth).toBe(40);

    //         fixture.componentInstance.minPixelWidth = null;
    //         fixture.detectChanges();

    //         expect(directive.minPixelWidth).toBe(null);
    //         expect(nativeElement.minPixelWidth).toBe(null);
    //     });

    //     it('can be configured with attribute binding for groupIndex', () => {
    //         expect(directive.groupIndex).toBe(0);
    //         expect(nativeElement.groupIndex).toBe(0);

    //         fixture.componentInstance.groupIndex = 1;
    //         fixture.detectChanges();

    //         expect(directive.groupIndex).toBe(1);
    //         expect(nativeElement.groupIndex).toBe(1);
    //     });

    //     it('can be configured with attribute binding for groupIndex updated to null', () => {
    //         expect(directive.groupIndex).toBe(0);
    //         expect(nativeElement.groupIndex).toBe(0);

    //         fixture.componentInstance.groupIndex = null;
    //         fixture.detectChanges();

    //         expect(directive.groupIndex).toBe(null);
    //         expect(nativeElement.groupIndex).toBe(null);
    //     });

    //     it('can be configured with attribute binding for groupingDisabled', () => {
    //         expect(directive.groupingDisabled).toBe(false);
    //         expect(nativeElement.groupingDisabled).toBe(false);

    //         fixture.componentInstance.groupingDisabled = true;
    //         fixture.detectChanges();

    //         expect(directive.groupingDisabled).toBe(true);
    //         expect(nativeElement.groupingDisabled).toBe(true);
    //     });

    //     it('can be configured with attribute binding for placeholder', () => {
    //         expect(directive.placeholder).toBe('Custom placeholder');
    //         expect(nativeElement.placeholder).toBe('Custom placeholder');

    //         fixture.componentInstance.placeholder = 'Updated placeholder';
    //         fixture.detectChanges();

    //         expect(directive.placeholder).toBe('Updated placeholder');
    //         expect(nativeElement.placeholder).toBe('Updated placeholder');
    //     });
    // });
});

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { actionMenuLabel1, actionMenuSlot1, columnBaseProperties, columnHidden1, columnId1, customSortOrderProperties, fractionalWidthValue1, groupIndexValue1, groupableColumnProperties, groupingDisabledValue1, minPixelWidthValue1, placeholder1, placeholderProperties, sortByFieldName1, sortDirection1, sortIndex1, sortableColumnProperties, sortingDisabled1 } from '@ni/nimble-angular/table-column/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import type { TableColumnSortDirection } from '@ni/nimble-angular/table-column';
import { NimbleTableColumnAnchorDirective, TableColumnAnchor } from '../nimble-table-column-anchor.directive';
import { NimbleTableColumnAnchorModule } from '../nimble-table-column-anchor.module';

describe('Nimble anchor table column', () => {
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
    const appearance1 = 'prominent';
    const appearance2 = 'subtle';

    class BaseTestHostComponent {
        public hreflang: string = hreflang1;
        public ping: string = ping1;
        public referrerpolicy: string = referrerpolicy1;
        public rel: string = rel1;
        public target: string = target1;
        public type: string = type1;
        public download: string = download1;
        public labelFieldName: string = labelFieldName1;
        public hrefFieldName: string = hrefFieldName1;
        public appearance: string | undefined = appearance1;
        public underlineHidden: boolean = underlineHidden1;
        public columnId: string = columnId1;
        public columnHidden: boolean = columnHidden1;
        public actionMenuSlot: string = actionMenuSlot1;
        public actionMenuLabel: string = actionMenuLabel1;
        public sortDirection: TableColumnSortDirection = sortDirection1;
        public sortIndex: number | null = sortIndex1;
        public sortingDisabled: boolean = sortingDisabled1;
        public sortByFieldName: string = sortByFieldName1;
        public fractionalWidth: number | null = fractionalWidthValue1;
        public minPixelWidth: number | null = minPixelWidthValue1;
        public groupIndex: number | null = groupIndexValue1;
        public groupingDisabled: boolean = groupingDisabledValue1;
        public placeholder: string = placeholder1;
    }

    type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

    interface TableColumnProperty<TDirectiveType, THostComponent> {
        name: string;
        property: keyof TDirectiveType & keyof THostComponent;
        defaultValue: PropType<TDirectiveType, keyof TDirectiveType> & PropType<THostComponent, keyof THostComponent>;
        value1: PropType<TDirectiveType, keyof TDirectiveType> & PropType<THostComponent, keyof THostComponent>;
        value2: PropType<TDirectiveType, keyof TDirectiveType> & PropType<THostComponent, keyof THostComponent>;
    }

    const properties: TableColumnProperty<NimbleTableColumnAnchorDirective, BaseTestHostComponent>[] = [
        { name: 'hreflang', property: 'hreflang', defaultValue: undefined, value1: hreflang1, value2: hreflang2 },
        { name: 'ping', property: 'ping', defaultValue: undefined, value1: ping1, value2: ping2 },
        { name: 'referrerpolicy', property: 'referrerpolicy', defaultValue: undefined, value1: referrerpolicy1, value2: referrerpolicy2 },
        { name: 'rel', property: 'rel', defaultValue: undefined, value1: rel1, value2: rel2 },
        { name: 'target', property: 'target', defaultValue: undefined, value1: target1, value2: target2 },
        { name: 'type', property: 'type', defaultValue: undefined, value1: type1, value2: type2 },
        { name: 'download', property: 'download', defaultValue: undefined, value1: download1, value2: download2 },
        { name: 'labelFieldName', property: 'labelFieldName', defaultValue: undefined, value1: labelFieldName1, value2: labelFieldName2 },
        { name: 'hrefFieldName', property: 'hrefFieldName', defaultValue: undefined, value1: hrefFieldName1, value2: hrefFieldName2 },
        { name: 'appearance', property: 'appearance', defaultValue: undefined, value1: appearance1, value2: appearance2 },
        { name: 'underlineHidden', property: 'underlineHidden', defaultValue: false, value1: underlineHidden1, value2: underlineHidden2 },
        ...columnBaseProperties,
        ...placeholderProperties,
        ...groupableColumnProperties,
        ...sortableColumnProperties,
        ...customSortOrderProperties
    ] as const;

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
                    referrerpolicy="${referrerpolicy1}"
                    rel="${rel1}"
                    target="${target1}"
                    type="${type1}"
                    download="${download1}"
                    label-field-name="${labelFieldName1}"
                    href-field-name="${hrefFieldName1}"
                    appearance="${appearance1}"
                    underline-hidden
                    column-id="${columnId1}"
                    column-hidden
                    action-menu-slot="${actionMenuSlot1}"
                    action-menu-label="${actionMenuLabel1}"
                    sort-direction="${sortDirection1}"
                    sort-index="${sortIndex1}"
                    sorting-disabled
                    sort-by-field-name="${sortByFieldName1}"
                    fractional-width="${fractionalWidthValue1}"
                    min-pixel-width="${minPixelWidthValue1}"
                    group-index="${groupIndexValue1}"
                    grouping-disabled
                    placeholder="${placeholder1}"
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
                    [referrerpolicy]="referrerpolicy"
                    [rel]="rel"
                    [target]="target"
                    [type]="type"
                    [download]="download"
                    [labelFieldName]="labelFieldName"
                    [hrefFieldName]="hrefFieldName"
                    [appearance]="appearance"
                    [underline-hidden]="underlineHidden"
                    [column-id]="columnId"
                    [column-hidden]="columnHidden"
                    [action-menu-slot]="actionMenuSlot"
                    [action-menu-label]="actionMenuLabel"
                    [sort-direction]="sortDirection"
                    [sort-index]="sortIndex"
                    [sorting-disabled]="sortingDisabled"
                    [sort-by-field-name]="sortByFieldName"
                    [fractional-width]="fractionalWidth"
                    [min-pixel-width]="minPixelWidth"
                    [group-index]="groupIndex"
                    [grouping-disabled]="groupingDisabled"
                    [placeholder]="placeholder"
                >
                </nimble-table-column-anchor>
            `
        })
        class TestHostComponent extends BaseTestHostComponent {
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
            spec(`can be configured with property binding for ${name}`, () => {
                expect(directive[value.property]).toBe(value.value1);
                expect(nativeElement[value.property]).toBe(value.value1);

                // fixture.componentInstance[value.property] = value.value2;
                (fixture.componentInstance[value.property] as unknown) = value.value2;
                fixture.detectChanges();

                expect(directive[value.property]).toBe(value.value2);
                expect(nativeElement[value.property]).toBe(value.value2);
            });
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table-column-anchor #column
                    [attr.column-id]="columnId"
                    [attr.hreflang]="hreflang"
                    [attr.ping]="ping"
                    [attr.referrerpolicy]="referrerpolicy"
                    [attr.rel]="rel"
                    [attr.target]="target"
                    [attr.type]="type"
                    [attr.download]="download"
                    [attr.label-field-name]="labelFieldName"
                    [attr.href-field-name]="hrefFieldName"
                    [attr.appearance]="appearance"
                    [attr.underline-hidden]="underlineHidden"
                    [attr.action-menu-slot]="actionMenuSlot"
                    [attr.action-menu-label]="actionMenuLabel"
                    [attr.column-hidden]="columnHidden"
                    [attr.sort-direction]="sortDirection"
                    [attr.sort-index]="sortIndex"
                    [attr.sorting-disabled]="sortingDisabled"
                    [attr.sort-by-field-name]="sortByFieldName"
                    [attr.fractional-width]="fractionalWidth"
                    [attr.min-pixel-width]="minPixelWidth"
                    [attr.group-index]="groupIndex"
                    [attr.grouping-disabled]="groupingDisabled"
                    [attr.placeholder]="placeholder"
                    >
                </nimble-table-column-anchor>
            `
        })
        class TestHostComponent extends BaseTestHostComponent {
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
            spec(`can be configured with attribute binding for ${name}`, () => {
                expect(directive[value.property]).toBe(value.value1);
                expect(nativeElement[value.property]).toBe(value.value1);

                (fixture.componentInstance[value.property] as unknown) = value.value2;
                fixture.detectChanges();

                expect(directive[value.property]).toBe(value.value2);
                expect(nativeElement[value.property]).toBe(value.value2);
            });
        });
    });
});

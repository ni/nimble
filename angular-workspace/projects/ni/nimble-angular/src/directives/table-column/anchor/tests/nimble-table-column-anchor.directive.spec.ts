import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

        it('has expected defaults for hreflang', () => {
            expect(directive.hreflang).toBeUndefined();
            expect(nativeElement.hreflang).toBeUndefined();
        });

        it('has expected defaults for ping', () => {
            expect(directive.ping).toBeUndefined();
            expect(nativeElement.ping).toBeUndefined();
        });

        it('has expected defaults for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBeUndefined();
            expect(nativeElement.referrerpolicy).toBeUndefined();
        });

        it('has expected defaults for rel', () => {
            expect(directive.rel).toBeUndefined();
            expect(nativeElement.rel).toBeUndefined();
        });

        it('has expected defaults for target', () => {
            expect(directive.target).toBeUndefined();
            expect(nativeElement.target).toBeUndefined();
        });

        it('has expected defaults for type', () => {
            expect(directive.type).toBeUndefined();
            expect(nativeElement.type).toBeUndefined();
        });

        it('has expected defaults for download', () => {
            expect(directive.download).toBeUndefined();
            expect(nativeElement.download).toBeUndefined();
        });

        it('has expected defaults for labelFieldName', () => {
            expect(directive.labelFieldName).toBeUndefined();
            expect(nativeElement.labelFieldName).toBeUndefined();
        });

        it('has expected defaults for hrefFieldName', () => {
            expect(directive.hrefFieldName).toBeUndefined();
            expect(nativeElement.hrefFieldName).toBeUndefined();
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBeUndefined();
            expect(nativeElement.placeholder).toBeUndefined();
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
                    label-field-name="label"
                    href-field-name="href"
                    placeholder="no value"
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

        it('will use template string values for hreflang', () => {
            expect(directive.hreflang).toBe(hreflang1);
            expect(nativeElement.hreflang).toBe(hreflang1);
        });

        it('will use template string values for ping', () => {
            expect(directive.ping).toBe(ping1);
            expect(nativeElement.ping).toBe(ping1);
        });

        it('will use template string values for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBe(referrerpolicy1);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);
        });

        it('will use template string values for rel', () => {
            expect(directive.rel).toBe(rel1);
            expect(nativeElement.rel).toBe(rel1);
        });

        it('will use template string values for target', () => {
            expect(directive.target).toBe(target1);
            expect(nativeElement.target).toBe(target1);
        });

        it('will use template string values for type', () => {
            expect(directive.type).toBe(type1);
            expect(nativeElement.type).toBe(type1);
        });

        it('will use template string values for download', () => {
            expect(directive.download).toBe(download1);
            expect(nativeElement.download).toBe(download1);
        });

        it('will use template string values for labelFieldName', () => {
            expect(directive.labelFieldName).toBe('label');
            expect(nativeElement.labelFieldName).toBe('label');
        });

        it('will use template string values for hrefFieldName', () => {
            expect(directive.hrefFieldName).toBe('href');
            expect(nativeElement.hrefFieldName).toBe('href');
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('no value');
            expect(nativeElement.placeholder).toBe('no value');
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
                    [label-field-name]="labelFieldName"
                    [href-field-name]="hrefFieldName"
                    [placeholder]="placeholder"
                    >
                    </nimble-table-column-anchor>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnAnchorDirective }) public directive: NimbleTableColumnAnchorDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnAnchor>;
            public hreflang = hreflang1;
            public ping = ping1;
            public referrerpolicy = referrerpolicy1;
            public rel = rel1;
            public target = target1;
            public type = type1;
            public download = download1;
            public labelFieldName = 'label';
            public hrefFieldName = 'href';
            public placeholder = 'no value';
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

        it('can be configured with property binding for hreflang', () => {
            expect(directive.hreflang).toBe(hreflang1);
            expect(nativeElement.hreflang).toBe(hreflang1);

            fixture.componentInstance.hreflang = hreflang2;
            fixture.detectChanges();

            expect(directive.hreflang).toBe(hreflang2);
            expect(nativeElement.hreflang).toBe(hreflang2);
        });

        it('can be configured with property binding for ping', () => {
            expect(directive.ping).toBe(ping1);
            expect(nativeElement.ping).toBe(ping1);

            fixture.componentInstance.ping = ping2;
            fixture.detectChanges();

            expect(directive.ping).toBe(ping2);
            expect(nativeElement.ping).toBe(ping2);
        });

        it('can be configured with property binding for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBe(referrerpolicy1);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);

            fixture.componentInstance.referrerpolicy = referrerpolicy2;
            fixture.detectChanges();

            expect(directive.referrerpolicy).toBe(referrerpolicy2);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy2);
        });

        it('can be configured with property binding for rel', () => {
            expect(directive.rel).toBe(rel1);
            expect(nativeElement.rel).toBe(rel1);

            fixture.componentInstance.rel = rel2;
            fixture.detectChanges();

            expect(directive.rel).toBe(rel2);
            expect(nativeElement.rel).toBe(rel2);
        });

        it('can be configured with property binding for target', () => {
            expect(directive.target).toBe(target1);
            expect(nativeElement.target).toBe(target1);

            fixture.componentInstance.target = target2;
            fixture.detectChanges();

            expect(directive.target).toBe(target2);
            expect(nativeElement.target).toBe(target2);
        });

        it('can be configured with property binding for type', () => {
            expect(directive.type).toBe(type1);
            expect(nativeElement.type).toBe(type1);

            fixture.componentInstance.type = type2;
            fixture.detectChanges();

            expect(directive.type).toBe(type2);
            expect(nativeElement.type).toBe(type2);
        });

        it('can be configured with property binding for download', () => {
            expect(directive.download).toBe(download1);
            expect(nativeElement.download).toBe(download1);

            fixture.componentInstance.download = download2;
            fixture.detectChanges();

            expect(directive.download).toBe(download2);
            expect(nativeElement.download).toBe(download2);
        });

        it('can be configured with property binding for labelFieldName', () => {
            expect(directive.labelFieldName).toBe('label');
            expect(nativeElement.labelFieldName).toBe('label');

            fixture.componentInstance.labelFieldName = 'foo';
            fixture.detectChanges();

            expect(directive.labelFieldName).toBe('foo');
            expect(nativeElement.labelFieldName).toBe('foo');
        });

        it('can be configured with property binding for hrefFieldName', () => {
            expect(directive.hrefFieldName).toBe('href');
            expect(nativeElement.hrefFieldName).toBe('href');

            fixture.componentInstance.hrefFieldName = 'foo';
            fixture.detectChanges();

            expect(directive.hrefFieldName).toBe('foo');
            expect(nativeElement.hrefFieldName).toBe('foo');
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('no value');
            expect(nativeElement.placeholder).toBe('no value');

            fixture.componentInstance.placeholder = 'foo';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('foo');
            expect(nativeElement.placeholder).toBe('foo');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
            <nimble-table-column-anchor #column
                    [attr.hreflang]="hreflang"
                    [attr.ping]="ping"
                    [attr.referrerpolicy]="referrerpolicy"
                    [attr.rel]="rel"
                    [attr.target]="target"
                    [attr.type]="type"
                    [attr.download]="download"
                    [attr.label-field-name]="labelFieldName"
                    [attr.href-field-name]="hrefFieldName"
                    [attr.placeholder]="placeholder"
                    >
                    </nimble-table-column-anchor>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnAnchorDirective }) public directive: NimbleTableColumnAnchorDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnAnchor>;
            public hreflang = hreflang1;
            public ping = ping1;
            public referrerpolicy = referrerpolicy1;
            public rel = rel1;
            public target = target1;
            public type = type1;
            public download = download1;
            public labelFieldName = 'label';
            public hrefFieldName = 'href';
            public placeholder = 'no value';
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

        it('can be configured with attribute binding for hreflang', () => {
            expect(directive.hreflang).toBe(hreflang1);
            expect(nativeElement.hreflang).toBe(hreflang1);

            fixture.componentInstance.hreflang = hreflang2;
            fixture.detectChanges();

            expect(directive.hreflang).toBe(hreflang2);
            expect(nativeElement.hreflang).toBe(hreflang2);
        });

        it('can be configured with attribute binding for ping', () => {
            expect(directive.ping).toBe(ping1);
            expect(nativeElement.ping).toBe(ping1);

            fixture.componentInstance.ping = ping2;
            fixture.detectChanges();

            expect(directive.ping).toBe(ping2);
            expect(nativeElement.ping).toBe(ping2);
        });

        it('can be configured with attribute binding for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBe(referrerpolicy1);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);

            fixture.componentInstance.referrerpolicy = referrerpolicy2;
            fixture.detectChanges();

            expect(directive.referrerpolicy).toBe(referrerpolicy2);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy2);
        });

        it('can be configured with attribute binding for rel', () => {
            expect(directive.rel).toBe(rel1);
            expect(nativeElement.rel).toBe(rel1);

            fixture.componentInstance.rel = rel2;
            fixture.detectChanges();

            expect(directive.rel).toBe(rel2);
            expect(nativeElement.rel).toBe(rel2);
        });

        it('can be configured with attribute binding for target', () => {
            expect(directive.target).toBe(target1);
            expect(nativeElement.target).toBe(target1);

            fixture.componentInstance.target = target2;
            fixture.detectChanges();

            expect(directive.target).toBe(target2);
            expect(nativeElement.target).toBe(target2);
        });

        it('can be configured with attribute binding for type', () => {
            expect(directive.type).toBe(type1);
            expect(nativeElement.type).toBe(type1);

            fixture.componentInstance.type = type2;
            fixture.detectChanges();

            expect(directive.type).toBe(type2);
            expect(nativeElement.type).toBe(type2);
        });

        it('can be configured with attribute binding for download', () => {
            expect(directive.download).toBe(download1);
            expect(nativeElement.download).toBe(download1);

            fixture.componentInstance.download = download2;
            fixture.detectChanges();

            expect(directive.download).toBe(download2);
            expect(nativeElement.download).toBe(download2);
        });

        it('can be configured with attribute binding for labelFieldName', () => {
            expect(directive.labelFieldName).toBe('label');
            expect(nativeElement.labelFieldName).toBe('label');

            fixture.componentInstance.labelFieldName = 'foo';
            fixture.detectChanges();

            expect(directive.labelFieldName).toBe('foo');
            expect(nativeElement.labelFieldName).toBe('foo');
        });

        it('can be configured with attribute binding for hrefFieldName', () => {
            expect(directive.hrefFieldName).toBe('href');
            expect(nativeElement.hrefFieldName).toBe('href');

            fixture.componentInstance.hrefFieldName = 'foo';
            fixture.detectChanges();

            expect(directive.hrefFieldName).toBe('foo');
            expect(nativeElement.hrefFieldName).toBe('foo');
        });

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('no value');
            expect(nativeElement.placeholder).toBe('no value');

            fixture.componentInstance.placeholder = 'foo';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('foo');
            expect(nativeElement.placeholder).toBe('foo');
        });
    });
});

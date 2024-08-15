import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnMappingModule } from '../../../table-column/mapping/nimble-table-column-mapping.module';
import { NimbleMappingEmptyDirective, type MappingEmpty } from '../nimble-mapping-empty.directive';
import { NimbleMappingEmptyModule } from '../nimble-mapping-empty.module';

describe('NimbleMappingEmpty', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMappingEmptyModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-mapping-empty')).not.toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-mapping key-type="boolean">
                        <nimble-mapping-empty
                            #mapping
                            key="false"
                            text="nope"
                        >
                        </nimble-mapping-empty>
                    </nimble-table-column-mapping>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingEmptyDirective }) public directive: NimbleMappingEmptyDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingEmpty>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingEmptyDirective;
        let nativeElement: MappingEmpty;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingEmptyModule, NimbleTableColumnMappingModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for key', () => {
            expect(directive.key).toBe('false');
            expect(nativeElement.key).toBe('false');
        });

        it('will use template string values for text', () => {
            expect(directive.text).toBe('nope');
            expect(nativeElement.text).toBe('nope');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-mapping key-type="boolean">
                        <nimble-mapping-empty
                            #mapping
                            [key]="key"
                            [text]="text"
                        >
                        </nimble-mapping-empty>
                    </nimble-table-column-mapping>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingEmptyDirective }) public directive: NimbleMappingEmptyDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingEmpty>;
            public key = false;
            public text = 'nope';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingEmptyDirective;
        let nativeElement: MappingEmpty;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingEmptyModule, NimbleTableColumnMappingModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for key', () => {
            expect(directive.key).toBeFalse();
            expect(nativeElement.key).toBeFalse();

            fixture.componentInstance.key = true;
            fixture.detectChanges();

            expect(directive.key).toBeTrue();
            expect(nativeElement.key).toBeTrue();
        });

        it('can be configured with property binding for text', () => {
            expect(directive.text).toBe('nope');
            expect(nativeElement.text).toBe('nope');

            fixture.componentInstance.text = 'yep';
            fixture.detectChanges();

            expect(directive.text).toBe('yep');
            expect(nativeElement.text).toBe('yep');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-mapping key-type="boolean">
                        <nimble-mapping-empty
                            #mapping
                            [attr.key]="key"
                            [attr.text]="text"
                        >
                        </nimble-mapping-empty>
                    </nimble-table-column-mapping>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingEmptyDirective }) public directive: NimbleMappingEmptyDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingEmpty>;
            public key = false;
            public text = 'nope';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingEmptyDirective;
        let nativeElement: MappingEmpty;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingEmptyModule, NimbleTableColumnMappingModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for key', () => {
            expect(directive.key).toBe('false');
            expect(nativeElement.key).toBe('false');

            fixture.componentInstance.key = true;
            fixture.detectChanges();

            expect(directive.key).toBe('true');
            expect(nativeElement.key).toBe('true');
        });

        it('can be configured with attribute binding for text', () => {
            expect(directive.text).toBe('nope');
            expect(nativeElement.text).toBe('nope');

            fixture.componentInstance.text = 'yep';
            fixture.detectChanges();

            expect(directive.text).toBe('yep');
            expect(nativeElement.text).toBe('yep');
        });
    });
});

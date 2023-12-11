import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnIconModule } from '../../../table-column/icon/nimble-table-column-icon.module';
import { NimbleMappingSpinnerDirective, type MappingSpinner } from '../nimble-mapping-spinner.directive';
import { NimbleMappingSpinnerModule } from '../nimble-mapping-spinner.module';

describe('NimbleMappingSpinner', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMappingSpinnerModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-mapping-spinner')).not.toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-icon key-type="boolean">
                        <nimble-mapping-spinner
                            #mapping
                            key="false"
                            text="nope"
                        >
                        </nimble-mapping-spinner>
                    </nimble-table-column-icon>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingSpinnerDirective }) public directive: NimbleMappingSpinnerDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingSpinner>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingSpinnerDirective;
        let nativeElement: MappingSpinner;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingSpinnerModule, NimbleTableColumnIconModule, NimbleTableModule]
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
                    <nimble-table-column-icon key-type="boolean">
                        <nimble-mapping-spinner
                            #mapping
                            [key]="key"
                            [text]="text"
                        >
                        </nimble-mapping-spinner>
                    </nimble-table-column-icon>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingSpinnerDirective }) public directive: NimbleMappingSpinnerDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingSpinner>;
            public key = false;
            public text = 'nope';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingSpinnerDirective;
        let nativeElement: MappingSpinner;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingSpinnerModule, NimbleTableColumnIconModule, NimbleTableModule]
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
                    <nimble-table-column-icon key-type="boolean">
                        <nimble-mapping-spinner
                            #mapping
                            [attr.key]="key"
                            [attr.text]="text"
                        >
                        </nimble-mapping-spinner>
                    </nimble-table-column-icon>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingSpinnerDirective }) public directive: NimbleMappingSpinnerDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingSpinner>;
            public key = false;
            public text = 'nope';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingSpinnerDirective;
        let nativeElement: MappingSpinner;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingSpinnerModule, NimbleTableColumnIconModule, NimbleTableModule]
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
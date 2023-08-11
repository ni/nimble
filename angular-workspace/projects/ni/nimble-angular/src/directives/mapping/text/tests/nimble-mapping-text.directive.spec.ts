import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../../../table/nimble-table.module';
import { NimbleTableColumnEnumTextModule } from '../../../../../table-column/enum-text/nimble-table-column-enum-text.module';
import { NimbleMappingTextDirective, type MappingText } from '../nimble-mapping-text.directive';

describe('NimbleMappingText', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTableColumnEnumTextModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-mapping-text')).not.toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-enum-text key-type="boolean">
                        <nimble-mapping-text
                            #mapping
                            key="false"
                            text="nope"
                        >
                        </nimble-mapping-text>
                    </nimble-table-column-enum-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingTextDirective }) public directive: NimbleMappingTextDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingTextDirective;
        let nativeElement: MappingText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnEnumTextModule, NimbleTableModule]
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
                    <nimble-table-column-enum-text key-type="boolean">
                        <nimble-mapping-text
                            #mapping
                            [key]="key"
                            [text]="text"
                        >
                        </nimble-mapping-text>
                    </nimble-table-column-enum-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingTextDirective }) public directive: NimbleMappingTextDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingText>;
            public key = false;
            public text = 'nope';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingTextDirective;
        let nativeElement: MappingText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnEnumTextModule, NimbleTableModule]
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
                    <nimble-table-column-enum-text key-type="boolean">
                        <nimble-mapping-text
                            #mapping
                            [attr.key]="key"
                            [attr.text]="text"
                        >
                        </nimble-mapping-text>
                    </nimble-table-column-enum-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingTextDirective }) public directive: NimbleMappingTextDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingText>;
            public key = false;
            public text = 'nope';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingTextDirective;
        let nativeElement: MappingText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnEnumTextModule, NimbleTableModule]
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

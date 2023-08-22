import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconSeverity } from '@ni/nimble-angular';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnIconModule } from '../../../table-column/icon/nimble-table-column-icon.module';
import { NimbleMappingIconDirective, type MappingIcon } from '../nimble-mapping-icon.directive';
import { NimbleMappingIconModule } from '../nimble-mapping-icon.module';

describe('NimbleMappingIcon', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMappingIconModule]
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
                    <nimble-table-column-icon key-type="boolean">
                        <nimble-mapping-icon
                            #mapping
                            key="false"
                            text="nope"
                            icon="nimble-icon-xmark"
                            severity="error"
                        >
                        </nimble-mapping-icon>
                    </nimble-table-column-icon>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingIconDirective }) public directive: NimbleMappingIconDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingIcon>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingIconDirective;
        let nativeElement: MappingIcon;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingIconModule, NimbleTableColumnIconModule, NimbleTableModule]
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

        it('will use template string values for icon', () => {
            expect(directive.text).toBe('nimble-icon-xmark');
            expect(nativeElement.text).toBe('nimble-icon-xmark');
        });

        it('will use template string values for severity', () => {
            expect(directive.text).toBe('error');
            expect(nativeElement.text).toBe('error');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-icon key-type="boolean">
                        <nimble-mapping-icon
                            #mapping
                            [key]="key"
                            [text]="text"
                            [icon]="icon"
                            [severity]="severity"
                        >
                        </nimble-mapping-icon>
                    </nimble-table-column-icon>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingIconDirective }) public directive: NimbleMappingIconDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingIcon>;
            public key = false;
            public text = 'nope';
            public icon = 'nimble-icon-xmark';
            public severity: IconSeverity = IconSeverity.error;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingIconDirective;
        let nativeElement: MappingIcon;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingIconModule, NimbleTableColumnIconModule, NimbleTableModule]
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

        it('can be configured with property binding for icon', () => {
            expect(directive.icon).toBe('nimble-icon-xmark');
            expect(nativeElement.icon).toBe('nimble-icon-xmark');

            fixture.componentInstance.icon = 'nimble-icon-check';
            fixture.detectChanges();

            expect(directive.icon).toBe('nimble-icon-check');
            expect(nativeElement.icon).toBe('nimble-icon-check');
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe('error');
            expect(nativeElement.severity).toBe('error');

            fixture.componentInstance.severity = IconSeverity.success;
            fixture.detectChanges();

            expect(directive.severity).toBe('success');
            expect(nativeElement.severity).toBe('success');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-icon key-type="boolean">
                        <nimble-mapping-icon
                            #mapping
                            [attr.key]="key"
                            [attr.text]="text"
                            [attr.icon]="icon"
                            [attr.severity]="severity"
                        >
                        </nimble-mapping-icon>
                    </nimble-table-column-icon>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingIconDirective }) public directive: NimbleMappingIconDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingIcon>;
            public key = false;
            public text = 'nope';
            public icon = 'nimble-icon-xmark';
            public severity: IconSeverity = IconSeverity.error;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingIconDirective;
        let nativeElement: MappingIcon;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingIconModule, NimbleTableColumnIconModule, NimbleTableModule]
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

        it('can be configured with property binding for icon', () => {
            expect(directive.icon).toBe('nimble-icon-xmark');
            expect(nativeElement.icon).toBe('nimble-icon-xmark');

            fixture.componentInstance.icon = 'nimble-icon-check';
            fixture.detectChanges();

            expect(directive.icon).toBe('nimble-icon-check');
            expect(nativeElement.icon).toBe('nimble-icon-check');
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe('error');
            expect(nativeElement.severity).toBe('error');

            fixture.componentInstance.severity = IconSeverity.success;
            fixture.detectChanges();

            expect(directive.severity).toBe('success');
            expect(nativeElement.severity).toBe('success');
        });
    });
});
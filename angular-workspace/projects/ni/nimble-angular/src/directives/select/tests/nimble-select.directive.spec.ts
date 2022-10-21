import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownAppearance } from '../../../public-api';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleSelectDirective, Select } from '../nimble-select.directive';
import { NimbleSelectModule } from '../nimble-select.module';

describe('Nimble select', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleSelectModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-select')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-select #select></nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.underline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.underline);
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });

        it('can use the directive to set errorText', () => {
            directive.errorText = 'new value';
            expect(nativeElement.errorText).toBe('new value');
        });

        it('has expected defaults for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();
        });

        it('can use the directive to set errorVisible', () => {
            directive.errorVisible = true;
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-select #select
                    disabled
                    appearance="${DropdownAppearance.block}"
                    error-text="error text"
                    error-visible
                >
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('error text');
            expect(nativeElement.errorText).toBe('error text');
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-select #select
                    [disabled] = "disabled"
                    [appearance]="appearance"
                    [error-text]="errorText"
                    [error-visible]="errorVisible"
                >
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
            public disabled = false;
            public appearance: DropdownAppearance = DropdownAppearance.block;
            public errorText = 'initial value';
            public errorVisible = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);

            fixture.componentInstance.appearance = DropdownAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(DropdownAppearance.outline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.outline);
        });

        it('can be configured with property binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with property binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = true;
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-select #select
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.error-text]="errorText"
                    [attr.error-visible]="errorVisible"
                >
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: DropdownAppearance = DropdownAppearance.block;
            public errorText = 'initial value';
            public errorVisible: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);

            fixture.componentInstance.appearance = DropdownAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(DropdownAppearance.outline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.outline);
        });

        it('can be configured with attribute binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with attribute binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = '';
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });
});
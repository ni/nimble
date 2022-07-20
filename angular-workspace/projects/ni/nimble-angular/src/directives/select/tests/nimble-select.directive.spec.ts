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
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-select #select 
                    disabled
                    appearance="${DropdownAppearance.block}">
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

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-select #select
                    [disabled] = "disabled"
                    [appearance]="appearance">
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
            public disabled = false;
            public appearance: DropdownAppearance = DropdownAppearance.block;
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
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-select #select
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance">
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: DropdownAppearance = DropdownAppearance.block;
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
    });
});
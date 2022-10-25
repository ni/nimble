import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonAppearance } from '../../../public-api';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { Button, NimbleButtonDirective, ButtonAppearanceVariant } from '../nimble-button.directive';
import { NimbleButtonModule } from '../nimble-button.module';

describe('Nimble button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleButtonModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-button')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-button #button></nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleButtonDirective;
        let nativeElement: Button;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);
        });

        it('has expected defaults for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.default);
        });

        it('has expected defaults for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-button #button
                    disabled
                    appearance="ghost"
                    appearance-variant="primary"
                    content-hidden>
                </nimble-button>`
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleButtonDirective;
        let nativeElement: Button;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('will use template string values for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
        });

        it('will use template string values for contentHidden', () => {
            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-button #button
                    [disabled]="disabled"
                    [appearance]="appearance"
                    [appearance-variant]="appearanceVariant"
                    [content-hidden]="contentHidden">
                </nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
            public disabled = false;
            public appearance: ButtonAppearance = ButtonAppearance.outline;
            public appearanceVariant: ButtonAppearanceVariant;
            public contentHidden = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleButtonDirective;
        let nativeElement: Button;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);

            fixture.componentInstance.appearance = ButtonAppearance.ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('can be configured with property binding for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.default);

            fixture.componentInstance.appearanceVariant = ButtonAppearanceVariant.primary;
            fixture.detectChanges();

            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
        });

        it('can be configured with property binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = true;
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-button #button
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.appearance-variant]="appearanceVariant"
                    [attr.content-hidden]="contentHidden">
                </nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: ButtonAppearance = ButtonAppearance.outline;
            public appearanceVariant: ButtonAppearanceVariant;
            public contentHidden: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleButtonDirective;
        let nativeElement: Button;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);

            fixture.componentInstance.appearance = ButtonAppearance.ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('can be configured with attribute binding for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.default);

            fixture.componentInstance.appearanceVariant = ButtonAppearanceVariant.primary;
            fixture.detectChanges();

            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
        });

        it('can be configured with attribute binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = '';
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });
    });
});

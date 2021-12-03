import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from '@ni/nimble-components/dist/esm/button';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { BooleanAttribute } from '../../utilities/template-value-helpers';
import { NimbleButtonDirective } from '../nimble-button.directive';
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

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
            }).compileComponents();
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
        });

        it('has expected defaults', () => {
            const directive = fixture.componentInstance.directive;
            const nativeElement = fixture.componentInstance.elementRef.nativeElement;

            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
            expect(directive.appearance).toBe(ButtonAppearance.Outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Outline);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-button #button
                    disabled
                    appearance="${ButtonAppearance.Ghost}">
                </nimble-button>`
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
        }

        let fixture: ComponentFixture<TestHostComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
            }).compileComponents();
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
        });

        it('will use template string values', () => {
            const directive = fixture.componentInstance.directive;
            const nativeElement = fixture.componentInstance.elementRef.nativeElement;

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
            expect(directive.appearance).toBe(ButtonAppearance.Ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Ghost);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-button #button
                    [disabled]="disabled"
                    [appearance]="appearance">
                </nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
            public disabled = false;
            public appearance = ButtonAppearance.Outline;
        }

        let fixture: ComponentFixture<TestHostComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
            }).compileComponents();
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
        });

        it('can be configured with property binding', async () => {
            const directive = fixture.componentInstance.directive;
            const nativeElement = fixture.componentInstance.elementRef.nativeElement;

            expect(nativeElement.appearance).toBe(ButtonAppearance.Outline);
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.componentInstance.appearance = ButtonAppearance.Ghost;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
            expect(directive.appearance).toBe(ButtonAppearance.Ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Ghost);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-button #button
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance">
                </nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleButtonDirective }) public directive: NimbleButtonDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Button>;
            public disabled: BooleanAttribute = null;
            public appearance: ButtonAppearance = ButtonAppearance.Outline;
        }

        let fixture: ComponentFixture<TestHostComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleButtonModule]
            }).compileComponents();
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
        });

        it('can be configured with attribute binding', () => {
            const directive = fixture.componentInstance.directive;
            const nativeElement = fixture.componentInstance.elementRef.nativeElement;

            expect(directive.appearance).toBe(ButtonAppearance.Outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Outline);
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.componentInstance.appearance = ButtonAppearance.Ghost;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
            expect(directive.appearance).toBe(ButtonAppearance.Ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Ghost);
        });
    });
});

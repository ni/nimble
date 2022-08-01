import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleCardButtonDirective, CardButton } from '../nimble-card-button.directive';
import { NimbleCardButtonModule } from '../nimble-card-button.module';

describe('Nimble card button', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleCardButtonModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-card-button')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-card-button #cardButton></nimble-card-button>
            `
        })
        class TestHostComponent {
            @ViewChild('cardButton', { read: NimbleCardButtonDirective }) public directive: NimbleCardButtonDirective;
            @ViewChild('cardButton', { read: ElementRef }) public elementRef: ElementRef<CardButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCardButtonDirective;
        let nativeElement: CardButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCardButtonModule]
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

        it('can use the directive to set selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-card-button #cardButton
                    disabled
                    selected>
                </nimble-card-button>`
        })
        class TestHostComponent {
            @ViewChild('cardButton', { read: NimbleCardButtonDirective }) public directive: NimbleCardButtonDirective;
            @ViewChild('cardButton', { read: ElementRef }) public elementRef: ElementRef<CardButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCardButtonDirective;
        let nativeElement: CardButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCardButtonModule]
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

        it('will use template string values for selected', () => {
            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
            <nimble-card-button #cardButton
                [disabled]="disabled"
                [selected]="selected">
            </nimble-card-button>`
        })
        class TestHostComponent {
            @ViewChild('cardButton', { read: NimbleCardButtonDirective }) public directive: NimbleCardButtonDirective;
            @ViewChild('cardButton', { read: ElementRef }) public elementRef: ElementRef<CardButton>;
            public disabled = false;
            public selected = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCardButtonDirective;
        let nativeElement: CardButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCardButtonModule]
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

        it('can be configured with property binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = true;
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-card-button #cardButton
                    [attr.disabled]="disabled"
                    [attr.selected]="selected">
                </nimble-card-button>`
        })
        class TestHostComponent {
            @ViewChild('cardButton', { read: NimbleCardButtonDirective }) public directive: NimbleCardButtonDirective;
            @ViewChild('cardButton', { read: ElementRef }) public elementRef: ElementRef<CardButton>;
            public disabled: BooleanValueOrAttribute = null;
            public selected: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCardButtonDirective;
        let nativeElement: CardButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCardButtonModule]
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

        it('can be configured with attribute binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = '';
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });
});
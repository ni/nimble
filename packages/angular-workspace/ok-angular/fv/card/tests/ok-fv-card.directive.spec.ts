import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvCard, FvCardAppearance, FvCardInteractionMode, OkFvCardDirective } from '../ok-fv-card.directive';
import { OkFvCardModule } from '../ok-fv-card.module';

describe('Ok fv card', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvCardModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-card')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-card #card></ok-fv-card>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('card', { read: OkFvCardDirective }) public directive: OkFvCardDirective;
            @ViewChild('card', { read: ElementRef }) public elementRef: ElementRef<FvCard>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvCardDirective;
        let nativeElement: FvCard;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvCardModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for title', () => {
            expect(directive.title).toBe('');
            expect(nativeElement.title).toBe('');
        });

        it('has expected defaults for subtitle', () => {
            expect(directive.subtitle).toBe('');
            expect(nativeElement.subtitle).toBe('');
        });

        it('has expected defaults for description', () => {
            expect(directive.description).toBe('');
            expect(nativeElement.description).toBe('');
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(FvCardAppearance.outline);
            expect(nativeElement.appearance).toBe(FvCardAppearance.outline);
        });

        it('has expected defaults for interactionMode', () => {
            expect(directive.interactionMode).toBe(FvCardInteractionMode.static);
            expect(nativeElement.interactionMode).toBe(FvCardInteractionMode.static);
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBe(false);
            expect(nativeElement.disabled).toBe(false);
        });

        it('has expected defaults for initials', () => {
            expect(directive.initials).toBe('');
            expect(nativeElement.initials).toBe('');
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-card #card
                    title="Device health"
                    subtitle="Cell A"
                    description="Track operator-facing status and alerts."
                    appearance="block"
                    interaction-mode="card"
                    disabled
                    initials="DH">
                </ok-fv-card>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('card', { read: OkFvCardDirective }) public directive: OkFvCardDirective;
            @ViewChild('card', { read: ElementRef }) public elementRef: ElementRef<FvCard>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvCardDirective;
        let nativeElement: FvCard;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvCardModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for title', () => {
            expect(directive.title).toBe('Device health');
            expect(nativeElement.title).toBe('Device health');
        });

        it('will use template string values for subtitle', () => {
            expect(directive.subtitle).toBe('Cell A');
            expect(nativeElement.subtitle).toBe('Cell A');
        });

        it('will use template string values for description', () => {
            expect(directive.description).toBe('Track operator-facing status and alerts.');
            expect(nativeElement.description).toBe('Track operator-facing status and alerts.');
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(FvCardAppearance.block);
            expect(nativeElement.appearance).toBe(FvCardAppearance.block);
        });

        it('will use template string values for interactionMode', () => {
            expect(directive.interactionMode).toBe(FvCardInteractionMode.card);
            expect(nativeElement.interactionMode).toBe(FvCardInteractionMode.card);
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for initials', () => {
            expect(directive.initials).toBe('DH');
            expect(nativeElement.initials).toBe('DH');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-card #card
                    [card-title]="title"
                    [subtitle]="subtitle"
                    [description]="description"
                    [appearance]="appearance"
                    [interaction-mode]="interactionMode"
                    [disabled]="disabled"
                    [initials]="initials">
                </ok-fv-card>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('card', { read: OkFvCardDirective }) public directive: OkFvCardDirective;
            @ViewChild('card', { read: ElementRef }) public elementRef: ElementRef<FvCard>;
            public title = 'Device health';
            public subtitle = 'Cell A';
            public description = 'Track operator-facing status and alerts.';
            public appearance: FvCardAppearance = FvCardAppearance.outline;
            public interactionMode: FvCardInteractionMode = FvCardInteractionMode.static;
            public disabled = false;
            public initials = 'DH';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvCardDirective;
        let nativeElement: FvCard;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvCardModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for title', () => {
            expect(directive.title).toBe('Device health');
            expect(nativeElement.title).toBe('Device health');

            fixture.componentInstance.title = 'Operator queue';
            fixture.detectChanges();

            expect(directive.title).toBe('Operator queue');
            expect(nativeElement.title).toBe('Operator queue');
        });

        it('can be configured with property binding for subtitle', () => {
            expect(directive.subtitle).toBe('Cell A');
            expect(nativeElement.subtitle).toBe('Cell A');

            fixture.componentInstance.subtitle = 'Cell B';
            fixture.detectChanges();

            expect(directive.subtitle).toBe('Cell B');
            expect(nativeElement.subtitle).toBe('Cell B');
        });

        it('can be configured with property binding for description', () => {
            expect(directive.description).toBe('Track operator-facing status and alerts.');
            expect(nativeElement.description).toBe('Track operator-facing status and alerts.');

            fixture.componentInstance.description = 'Review open work items for the next shift.';
            fixture.detectChanges();

            expect(directive.description).toBe('Review open work items for the next shift.');
            expect(nativeElement.description).toBe('Review open work items for the next shift.');
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(FvCardAppearance.outline);
            expect(nativeElement.appearance).toBe(FvCardAppearance.outline);

            fixture.componentInstance.appearance = FvCardAppearance.block;
            fixture.detectChanges();

            expect(directive.appearance).toBe(FvCardAppearance.block);
            expect(nativeElement.appearance).toBe(FvCardAppearance.block);
        });

        it('can be configured with property binding for interactionMode', () => {
            expect(directive.interactionMode).toBe(FvCardInteractionMode.static);
            expect(nativeElement.interactionMode).toBe(FvCardInteractionMode.static);

            fixture.componentInstance.interactionMode = FvCardInteractionMode.card;
            fixture.detectChanges();

            expect(directive.interactionMode).toBe(FvCardInteractionMode.card);
            expect(nativeElement.interactionMode).toBe(FvCardInteractionMode.card);
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for initials', () => {
            expect(directive.initials).toBe('DH');
            expect(nativeElement.initials).toBe('DH');

            fixture.componentInstance.initials = 'OP';
            fixture.detectChanges();

            expect(directive.initials).toBe('OP');
            expect(nativeElement.initials).toBe('OP');
        });
    });
});

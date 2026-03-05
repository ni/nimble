import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type IconWorkItemCalendarWeek, SprightIconWorkItemCalendarWeekDirective, iconWorkItemCalendarWeekTag } from '@ni/spright-angular/icons/work-item-calendar-week';
import { IconSeverity } from '../spright-icon-base.directive';

// As the icons have identical apis, testing every icon is unnecessary.
// One icon is tested to represent them all.
describe('Spright icon calendar calibration', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SprightIconWorkItemCalendarWeekDirective]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get(iconWorkItemCalendarWeekTag)).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <spright-icon-work-item-calendar-week #icon></spright-icon-work-item-calendar-week>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconWorkItemCalendarWeekDirective }) public directive: SprightIconWorkItemCalendarWeekDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconWorkItemCalendarWeek>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconWorkItemCalendarWeekDirective;
        let nativeElement: IconWorkItemCalendarWeek;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconWorkItemCalendarWeekDirective]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBe(IconSeverity.default);
            expect(nativeElement.severity).toBe(IconSeverity.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <spright-icon-work-item-calendar-week #icon
                    severity="error"
                >
                </spright-icon-work-item-calendar-week>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconWorkItemCalendarWeekDirective }) public directive: SprightIconWorkItemCalendarWeekDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconWorkItemCalendarWeek>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconWorkItemCalendarWeekDirective;
        let nativeElement: IconWorkItemCalendarWeek;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconWorkItemCalendarWeekDirective]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe(IconSeverity.error);
            expect(nativeElement.severity).toBe(IconSeverity.error);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <spright-icon-work-item-calendar-week #icon
                    [severity]="severity"
                >
                </spright-icon-work-item-calendar-week>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconWorkItemCalendarWeekDirective }) public directive: SprightIconWorkItemCalendarWeekDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconWorkItemCalendarWeek>;
            public severity: IconSeverity;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconWorkItemCalendarWeekDirective;
        let nativeElement: IconWorkItemCalendarWeek;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconWorkItemCalendarWeekDirective]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe(IconSeverity.default);
            expect(nativeElement.severity).toBe(IconSeverity.default);

            fixture.componentInstance.severity = IconSeverity.error;
            fixture.detectChanges();

            expect(directive.severity).toBe(IconSeverity.error);
            expect(nativeElement.severity).toBe(IconSeverity.error);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <spright-icon-work-item-calendar-week #icon
                    [attr.severity]="severity"
                >
                </spright-icon-work-item-calendar-week>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconWorkItemCalendarWeekDirective }) public directive: SprightIconWorkItemCalendarWeekDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconWorkItemCalendarWeek>;
            public severity: IconSeverity;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconWorkItemCalendarWeekDirective;
        let nativeElement: IconWorkItemCalendarWeek;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconWorkItemCalendarWeekDirective]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for severity', () => {
            expect(directive.severity).toBe(IconSeverity.default);
            expect(nativeElement.severity).toBe(IconSeverity.default);

            fixture.componentInstance.severity = IconSeverity.error;
            fixture.detectChanges();

            expect(directive.severity).toBe(IconSeverity.error);
            expect(nativeElement.severity).toBe(IconSeverity.error);
        });
    });
});

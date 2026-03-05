import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconSeverity } from '../../public-api';
import { type IconCalendarCalibration, SprightIconCalendarCalibrationDirective } from '../../calendar-calibration/spright-icon-calendar-calibration.directive';
import { SprightIconCalendarCalibrationModule } from '../../calendar-calibration/spright-icon-calendar-calibration.module';

// As the icons have identical apis, testing every icon is unnecessary.
// One icon is tested to represent them all.
describe('Spright icon calendar calibration', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SprightIconCalendarCalibrationModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('spright-icon-calendar-calibration')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <spright-icon-calendar-calibration #icon></spright-icon-calendar-calibration>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconCalendarCalibrationDirective }) public directive: SprightIconCalendarCalibrationDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCalendarCalibration>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconCalendarCalibrationDirective;
        let nativeElement: IconCalendarCalibration;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconCalendarCalibrationModule]
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
                <spright-icon-calendar-calibration #icon
                    severity="error"
                >
                </spright-icon-calendar-calibration>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconCalendarCalibrationDirective }) public directive: SprightIconCalendarCalibrationDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCalendarCalibration>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconCalendarCalibrationDirective;
        let nativeElement: IconCalendarCalibration;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconCalendarCalibrationModule]
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
                <spright-icon-calendar-calibration #icon
                    [severity]="severity"
                >
                </spright-icon-calendar-calibration>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconCalendarCalibrationDirective }) public directive: SprightIconCalendarCalibrationDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCalendarCalibration>;
            public severity: IconSeverity;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconCalendarCalibrationDirective;
        let nativeElement: IconCalendarCalibration;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconCalendarCalibrationModule]
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
                <spright-icon-calendar-calibration #icon
                    [attr.severity]="severity"
                >
                </spright-icon-calendar-calibration>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('icon', { read: SprightIconCalendarCalibrationDirective }) public directive: SprightIconCalendarCalibrationDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCalendarCalibration>;
            public severity: IconSeverity;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: SprightIconCalendarCalibrationDirective;
        let nativeElement: IconCalendarCalibration;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [SprightIconCalendarCalibrationModule]
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

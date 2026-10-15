import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTextPipe } from '../date-text.pipe';

describe('DateTextPipe', () => {
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    it('formats numeric and Date values', () => {
        const pipe = new DateTextPipe('en-US');
        const timestamp = Date.UTC(2020, 0, 2);

        expect(pipe.transform(timestamp, options)).toBe('01/02/2020');
        expect(pipe.transform(new Date(timestamp), options)).toBe('01/02/2020');
    });

    it('returns an empty string for invalid values', () => {
        const pipe = new DateTextPipe('en-US');

        expect(pipe.transform(null, options)).toBe('');
        expect(pipe.transform(undefined, options)).toBe('');
        expect(pipe.transform(new Date('not a date'), options)).toBe('');
    });

    it('formats using the injected locale', () => {
        const pipe = new DateTextPipe('de-DE');

        expect(pipe.transform(Date.UTC(2020, 0, 2), options)).toBe('02.01.2020');
    });

    describe('in component template', () => {
        @Component({
            template: `
            <div #div>{{ value | dateText:{ timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' } }}</div>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('div') public divRef: ElementRef<HTMLDivElement>;
            public value = Date.UTC(2020, 0, 2);
        }
        let fixture: ComponentFixture<TestHostComponent>;
        let div: HTMLDivElement;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [DateTextPipe],
                providers: [provideZoneChangeDetection()],
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            div = fixture.componentInstance.divRef.nativeElement;
        });

        it('accepts parameters via object literal', () => {
            expect(div.innerText).toEqual('01/02/2020');
        });
    });
});
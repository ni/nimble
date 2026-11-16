import { Component, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OkFvTextFieldModule } from '../../text-field/ok-fv-text-field.module';
import { OkFvDateTimePickerModule } from '../../date-time-picker/ok-fv-date-time-picker.module';
import { OkFvMultiSelectModule } from '../ok-fv-multi-select.module';

@Component({
    template: `
        <ok-fv-text-field [formControl]="text"></ok-fv-text-field>
        <ok-fv-date-time-picker type="date" [(ngModel)]="date"></ok-fv-date-time-picker>
        <ok-fv-multi-select [formControl]="selection"></ok-fv-multi-select>
    `,
    standalone: false
})
class TestHostComponent {
    public text = new FormControl('initial');
    public date = '2025-01-02';
    public selection = new FormControl<string[]>(['a']);
}

describe('FV Angular form controls', () => {
    it('synchronizes values, touched state and disabled state', async () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [FormsModule, ReactiveFormsModule, OkFvTextFieldModule, OkFvDateTimePickerModule, OkFvMultiSelectModule],
            providers: [provideZoneChangeDetection()]
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;
        const text = root.querySelector('ok-fv-text-field')!;
        const date = root.querySelector('ok-fv-date-time-picker')!;
        const multi = root.querySelector('ok-fv-multi-select')!;
        expect(text.value).toBe('initial');
        expect(date.value).toBe('2025-01-02');
        expect(multi.selectedValues).toEqual(['a']);

        text.value = 'changed';
        text.dispatchEvent(new Event('input'));
        date.value = '2025-01-03';
        date.dispatchEvent(new Event('input'));
        multi.toggleOption({ value: 'b', label: 'B' });
        multi.dispatchEvent(new Event('blur'));
        expect(fixture.componentInstance.text.value).toBe('changed');
        expect(fixture.componentInstance.date).toBe('2025-01-03');
        expect(fixture.componentInstance.selection.value).toEqual(['a', 'b']);
        expect(fixture.componentInstance.selection.touched).toBeTrue();

        fixture.componentInstance.selection.reset();
        fixture.componentInstance.selection.disable();
        expect(multi.selectedValues).toEqual([]);
        expect(multi.disabled).toBeTrue();
    });
});

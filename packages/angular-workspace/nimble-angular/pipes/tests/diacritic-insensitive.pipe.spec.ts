import { DiacriticInsensitivePipe } from '../diacritic-insensitive.pipe';

describe('DiacriticInsensitivePipe', () => {
    it('can be constructed and used', () => {
        const pipe = new DiacriticInsensitivePipe();
        expect(pipe.transform('Français é, è, ê and ë (French characters)')).toBe('francais e, e, e and e (french characters)');
    });
});

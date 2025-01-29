import { Pipe, type PipeTransform } from '@angular/core';
import { diacriticInsensitiveStringNormalizer } from '@ni/nimble-components/dist/esm/utilities/models/string-normalizers';

/**
 * Generic normalize pipe that removes the accents and special characters.
 * This pipe can be used to normalize a string before performing diacritic-insensitive string comparisons.
 */
@Pipe({
    name: 'diacritic-insensitive',
    standalone: true
})
export class DiacriticInsensitivePipe implements PipeTransform {
    public transform(value: string | null | undefined): string {
        if (typeof value !== 'string') {
            return '';
        }
        return diacriticInsensitiveStringNormalizer(value);
    }
}

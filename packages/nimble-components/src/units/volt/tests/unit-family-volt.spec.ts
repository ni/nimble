import { UnitFamilyVolt, unitVoltTag } from '..';
import type { Unit } from '../../base/unit-family';

const compareConversionFactor = (a: Unit, b: Unit): number => {
    return a.conversionFactor < b.conversionFactor ? -1 : 1;
};

describe('Volt unit', () => {
    it('should export its tag', () => {
        expect(unitVoltTag).toBe('nimble-unit-volt');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-volt')).toBeInstanceOf(
            UnitFamilyVolt
        );
    });

    it('returns expected units (English)', () => {
        const unitElement = document.createElement('nimble-unit-volt');
        const units = unitElement
            .getSupportedUnits('en', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(14);
        expect(units[0]?.conversionFactor).toEqual(10 ** -15);
        expect(units[0]?.format(1)).toEqual('1 fV');
        expect(units[1]?.conversionFactor).toEqual(10 ** -12);
        expect(units[1]?.format(1)).toEqual('1 pV');
        expect(units[2]?.conversionFactor).toEqual(10 ** -9);
        expect(units[2]?.format(1)).toEqual('1 nV');
        expect(units[3]?.conversionFactor).toEqual(10 ** -6);
        expect(units[3]?.format(1)).toEqual('1 μV');
        expect(units[4]?.conversionFactor).toEqual(10 ** -3);
        expect(units[4]?.format(1)).toEqual('1 mV');
        expect(units[5]?.conversionFactor).toEqual(10 ** -2);
        expect(units[5]?.format(1)).toEqual('1 cV');
        expect(units[6]?.conversionFactor).toEqual(10 ** -1);
        expect(units[6]?.format(1)).toEqual('1 dV');
        expect(units[7]?.conversionFactor).toEqual(1);
        expect(units[7]?.format(1)).toEqual('1 volt');
        expect(units[7]?.format(2)).toEqual('2 volts');
        expect(units[8]?.conversionFactor).toEqual(10 ** 3);
        expect(units[8]?.format(1)).toEqual('1 kV');
        expect(units[9]?.conversionFactor).toEqual(10 ** 6);
        expect(units[9]?.format(1)).toEqual('1 MV');
        expect(units[10]?.conversionFactor).toEqual(10 ** 9);
        expect(units[10]?.format(1)).toEqual('1 GV');
        expect(units[11]?.conversionFactor).toEqual(10 ** 12);
        expect(units[11]?.format(1)).toEqual('1 TV');
        expect(units[12]?.conversionFactor).toEqual(10 ** 15);
        expect(units[12]?.format(1)).toEqual('1 PV');
        expect(units[13]?.conversionFactor).toEqual(10 ** 18);
        expect(units[13]?.format(1)).toEqual('1 EV');
    });

    it('returns expected units (French)', () => {
        const unitElement = document.createElement('nimble-unit-volt');
        const units = unitElement
            .getSupportedUnits('fr', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(14);
        expect(units[0]?.conversionFactor).toEqual(10 ** -15);
        expect(units[0]?.format(1)).toEqual('1 fV');
        expect(units[1]?.conversionFactor).toEqual(10 ** -12);
        expect(units[1]?.format(1)).toEqual('1 pV');
        expect(units[2]?.conversionFactor).toEqual(10 ** -9);
        expect(units[2]?.format(1)).toEqual('1 nV');
        expect(units[3]?.conversionFactor).toEqual(10 ** -6);
        expect(units[3]?.format(1)).toEqual('1 μV');
        expect(units[4]?.conversionFactor).toEqual(10 ** -3);
        expect(units[4]?.format(1)).toEqual('1 mV');
        expect(units[5]?.conversionFactor).toEqual(10 ** -2);
        expect(units[5]?.format(1)).toEqual('1 cV');
        expect(units[6]?.conversionFactor).toEqual(10 ** -1);
        expect(units[6]?.format(1)).toEqual('1 dV');
        expect(units[7]?.conversionFactor).toEqual(1);
        expect(units[7]?.format(1)).toEqual('1 volt');
        expect(units[7]?.format(2)).toEqual('2 volts');
        expect(units[8]?.conversionFactor).toEqual(10 ** 3);
        expect(units[8]?.format(1)).toEqual('1 kV');
        expect(units[9]?.conversionFactor).toEqual(10 ** 6);
        expect(units[9]?.format(1)).toEqual('1 MV');
        expect(units[10]?.conversionFactor).toEqual(10 ** 9);
        expect(units[10]?.format(1)).toEqual('1 GV');
        expect(units[11]?.conversionFactor).toEqual(10 ** 12);
        expect(units[11]?.format(1)).toEqual('1 TV');
        expect(units[12]?.conversionFactor).toEqual(10 ** 15);
        expect(units[12]?.format(1)).toEqual('1 PV');
        expect(units[13]?.conversionFactor).toEqual(10 ** 18);
        expect(units[13]?.format(1)).toEqual('1 EV');
    });

    it('returns expected units (German)', () => {
        const unitElement = document.createElement('nimble-unit-volt');
        const units = unitElement
            .getSupportedUnits('de', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(14);
        expect(units[0]?.conversionFactor).toEqual(10 ** -15);
        expect(units[0]?.format(1)).toEqual('1 fV');
        expect(units[1]?.conversionFactor).toEqual(10 ** -12);
        expect(units[1]?.format(1)).toEqual('1 pV');
        expect(units[2]?.conversionFactor).toEqual(10 ** -9);
        expect(units[2]?.format(1)).toEqual('1 nV');
        expect(units[3]?.conversionFactor).toEqual(10 ** -6);
        expect(units[3]?.format(1)).toEqual('1 μV');
        expect(units[4]?.conversionFactor).toEqual(10 ** -3);
        expect(units[4]?.format(1)).toEqual('1 mV');
        expect(units[5]?.conversionFactor).toEqual(10 ** -2);
        expect(units[5]?.format(1)).toEqual('1 cV');
        expect(units[6]?.conversionFactor).toEqual(10 ** -1);
        expect(units[6]?.format(1)).toEqual('1 dV');
        expect(units[7]?.conversionFactor).toEqual(1);
        expect(units[7]?.format(1)).toEqual('1 Volt');
        expect(units[7]?.format(2)).toEqual('2 Volt');
        expect(units[8]?.conversionFactor).toEqual(10 ** 3);
        expect(units[8]?.format(1)).toEqual('1 kV');
        expect(units[9]?.conversionFactor).toEqual(10 ** 6);
        expect(units[9]?.format(1)).toEqual('1 MV');
        expect(units[10]?.conversionFactor).toEqual(10 ** 9);
        expect(units[10]?.format(1)).toEqual('1 GV');
        expect(units[11]?.conversionFactor).toEqual(10 ** 12);
        expect(units[11]?.format(1)).toEqual('1 TV');
        expect(units[12]?.conversionFactor).toEqual(10 ** 15);
        expect(units[12]?.format(1)).toEqual('1 PV');
        expect(units[13]?.conversionFactor).toEqual(10 ** 18);
        expect(units[13]?.format(1)).toEqual('1 EV');
    });

    it('returns expected units (Japanese)', () => {
        const unitElement = document.createElement('nimble-unit-volt');
        const units = unitElement
            .getSupportedUnits('ja', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(14);
        expect(units[0]?.conversionFactor).toEqual(10 ** -15);
        expect(units[0]?.format(1)).toEqual('1 fV');
        expect(units[1]?.conversionFactor).toEqual(10 ** -12);
        expect(units[1]?.format(1)).toEqual('1 pV');
        expect(units[2]?.conversionFactor).toEqual(10 ** -9);
        expect(units[2]?.format(1)).toEqual('1 nV');
        expect(units[3]?.conversionFactor).toEqual(10 ** -6);
        expect(units[3]?.format(1)).toEqual('1 μV');
        expect(units[4]?.conversionFactor).toEqual(10 ** -3);
        expect(units[4]?.format(1)).toEqual('1 mV');
        expect(units[5]?.conversionFactor).toEqual(10 ** -2);
        expect(units[5]?.format(1)).toEqual('1 cV');
        expect(units[6]?.conversionFactor).toEqual(10 ** -1);
        expect(units[6]?.format(1)).toEqual('1 dV');
        expect(units[7]?.conversionFactor).toEqual(1);
        expect(units[7]?.format(1)).toEqual('1 ボルト');
        expect(units[7]?.format(2)).toEqual('2 ボルト');
        expect(units[8]?.conversionFactor).toEqual(10 ** 3);
        expect(units[8]?.format(1)).toEqual('1 kV');
        expect(units[9]?.conversionFactor).toEqual(10 ** 6);
        expect(units[9]?.format(1)).toEqual('1 MV');
        expect(units[10]?.conversionFactor).toEqual(10 ** 9);
        expect(units[10]?.format(1)).toEqual('1 GV');
        expect(units[11]?.conversionFactor).toEqual(10 ** 12);
        expect(units[11]?.format(1)).toEqual('1 TV');
        expect(units[12]?.conversionFactor).toEqual(10 ** 15);
        expect(units[12]?.format(1)).toEqual('1 PV');
        expect(units[13]?.conversionFactor).toEqual(10 ** 18);
        expect(units[13]?.format(1)).toEqual('1 EV');
    });

    it('returns expected units (Chinese)', () => {
        const unitElement = document.createElement('nimble-unit-volt');
        const units = unitElement
            .getSupportedUnits('zh', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(14);
        expect(units[0]?.conversionFactor).toEqual(10 ** -15);
        expect(units[0]?.format(1)).toEqual('1 fV');
        expect(units[1]?.conversionFactor).toEqual(10 ** -12);
        expect(units[1]?.format(1)).toEqual('1 pV');
        expect(units[2]?.conversionFactor).toEqual(10 ** -9);
        expect(units[2]?.format(1)).toEqual('1 nV');
        expect(units[3]?.conversionFactor).toEqual(10 ** -6);
        expect(units[3]?.format(1)).toEqual('1 μV');
        expect(units[4]?.conversionFactor).toEqual(10 ** -3);
        expect(units[4]?.format(1)).toEqual('1 mV');
        expect(units[5]?.conversionFactor).toEqual(10 ** -2);
        expect(units[5]?.format(1)).toEqual('1 cV');
        expect(units[6]?.conversionFactor).toEqual(10 ** -1);
        expect(units[6]?.format(1)).toEqual('1 dV');
        expect(units[7]?.conversionFactor).toEqual(1);
        expect(units[7]?.format(1)).toEqual('1 伏特');
        expect(units[7]?.format(2)).toEqual('2 伏特');
        expect(units[8]?.conversionFactor).toEqual(10 ** 3);
        expect(units[8]?.format(1)).toEqual('1 kV');
        expect(units[9]?.conversionFactor).toEqual(10 ** 6);
        expect(units[9]?.format(1)).toEqual('1 MV');
        expect(units[10]?.conversionFactor).toEqual(10 ** 9);
        expect(units[10]?.format(1)).toEqual('1 GV');
        expect(units[11]?.conversionFactor).toEqual(10 ** 12);
        expect(units[11]?.format(1)).toEqual('1 TV');
        expect(units[12]?.conversionFactor).toEqual(10 ** 15);
        expect(units[12]?.format(1)).toEqual('1 PV');
        expect(units[13]?.conversionFactor).toEqual(10 ** 18);
        expect(units[13]?.format(1)).toEqual('1 EV');
    });
});

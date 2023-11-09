import { VoltUnitScaleFormatter } from '../volt-unit-scale-formatter';

describe('VoltUnitScaleFormatter', () => {
    it('formats using expected units (English)', () => {
        const formatter = new VoltUnitScaleFormatter('en', {});
        expect(formatter.formatValue(10 ** -18).string).toEqual('0.001 fV');
        expect(formatter.formatValue(10 ** -15).string).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12).string).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9).string).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6).string).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3).string).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2).string).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1).string).toEqual('1 dV');
        expect(formatter.formatValue(1).string).toEqual('1 volt');
        expect(formatter.formatValue(2).string).toEqual('2 volts');
        expect(formatter.formatValue(10 ** 3).string).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6).string).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9).string).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12).string).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15).string).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18).string).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21).string).toEqual('1,000 EV');
    });

    it('formats using expected units (French)', () => {
        const formatter = new VoltUnitScaleFormatter('fr', {});
        expect(formatter.formatValue(10 ** -18).string).toEqual('0,001 fV');
        expect(formatter.formatValue(10 ** -15).string).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12).string).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9).string).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6).string).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3).string).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2).string).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1).string).toEqual('1 dV');
        expect(formatter.formatValue(1).string).toEqual('1 volt');
        expect(formatter.formatValue(2).string).toEqual('2 volts');
        expect(formatter.formatValue(10 ** 3).string).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6).string).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9).string).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12).string).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15).string).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18).string).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21).string).toEqual('1\u202f000 EV');
    });

    it('formats using expected units (German)', () => {
        const formatter = new VoltUnitScaleFormatter('de', {});
        expect(formatter.formatValue(10 ** -18).string).toEqual('0,001 fV');
        expect(formatter.formatValue(10 ** -15).string).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12).string).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9).string).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6).string).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3).string).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2).string).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1).string).toEqual('1 dV');
        expect(formatter.formatValue(1).string).toEqual('1 Volt');
        expect(formatter.formatValue(2).string).toEqual('2 Volt');
        expect(formatter.formatValue(10 ** 3).string).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6).string).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9).string).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12).string).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15).string).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18).string).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21).string).toEqual('1.000 EV');
    });

    it('formats using expected units (Japanese)', () => {
        const formatter = new VoltUnitScaleFormatter('ja', {});
        expect(formatter.formatValue(10 ** -18).string).toEqual('0.001 fV');
        expect(formatter.formatValue(10 ** -15).string).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12).string).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9).string).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6).string).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3).string).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2).string).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1).string).toEqual('1 dV');
        expect(formatter.formatValue(1).string).toEqual('1 ボルト');
        expect(formatter.formatValue(2).string).toEqual('2 ボルト');
        expect(formatter.formatValue(10 ** 3).string).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6).string).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9).string).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12).string).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15).string).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18).string).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21).string).toEqual('1,000 EV');
    });

    it('formats using expected units (Chinese)', () => {
        const formatter = new VoltUnitScaleFormatter('zh', {});
        expect(formatter.formatValue(10 ** -18).string).toEqual('0.001 fV');
        expect(formatter.formatValue(10 ** -15).string).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12).string).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9).string).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6).string).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3).string).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2).string).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1).string).toEqual('1 dV');
        expect(formatter.formatValue(1).string).toEqual('1 伏特');
        expect(formatter.formatValue(2).string).toEqual('2 伏特');
        expect(formatter.formatValue(10 ** 3).string).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6).string).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9).string).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12).string).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15).string).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18).string).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21).string).toEqual('1,000 EV');
    });
});

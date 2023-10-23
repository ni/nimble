import { VoltScaleFormatter } from '../volt-scale-formatter';

describe('VoltScaleFormatter', () => {
    it('formats using expected units (English)', () => {
        const formatter = new VoltScaleFormatter('en', {});
        expect(formatter.formatValue(10 ** -18)).toEqual('0.001 fV');
        expect(formatter.formatValue(10 ** -15)).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12)).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9)).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6)).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3)).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2)).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1)).toEqual('1 dV');
        expect(formatter.formatValue(1)).toEqual('1 volt');
        expect(formatter.formatValue(2)).toEqual('2 volts');
        expect(formatter.formatValue(10 ** 3)).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6)).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9)).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12)).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15)).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18)).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21)).toEqual('1,000 EV');
    });

    it('formats using expected units (French)', () => {
        const formatter = new VoltScaleFormatter('fr', {});
        expect(formatter.formatValue(10 ** -18)).toEqual('0,001 fV');
        expect(formatter.formatValue(10 ** -15)).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12)).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9)).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6)).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3)).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2)).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1)).toEqual('1 dV');
        expect(formatter.formatValue(1)).toEqual('1 volt');
        expect(formatter.formatValue(2)).toEqual('2 volts');
        expect(formatter.formatValue(10 ** 3)).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6)).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9)).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12)).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15)).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18)).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21)).toEqual('1\u202f000 EV');
    });

    it('formats using expected units (German)', () => {
        const formatter = new VoltScaleFormatter('de', {});
        expect(formatter.formatValue(10 ** -18)).toEqual('0,001 fV');
        expect(formatter.formatValue(10 ** -15)).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12)).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9)).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6)).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3)).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2)).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1)).toEqual('1 dV');
        expect(formatter.formatValue(1)).toEqual('1 Volt');
        expect(formatter.formatValue(2)).toEqual('2 Volt');
        expect(formatter.formatValue(10 ** 3)).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6)).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9)).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12)).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15)).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18)).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21)).toEqual('1.000 EV');
    });

    it('formats using expected units (Japanese)', () => {
        const formatter = new VoltScaleFormatter('ja', {});
        expect(formatter.formatValue(10 ** -18)).toEqual('0.001 fV');
        expect(formatter.formatValue(10 ** -15)).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12)).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9)).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6)).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3)).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2)).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1)).toEqual('1 dV');
        expect(formatter.formatValue(1)).toEqual('1 ボルト');
        expect(formatter.formatValue(2)).toEqual('2 ボルト');
        expect(formatter.formatValue(10 ** 3)).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6)).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9)).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12)).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15)).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18)).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21)).toEqual('1,000 EV');
    });

    it('formats using expected units (Chinese)', () => {
        const formatter = new VoltScaleFormatter('zh', {});
        expect(formatter.formatValue(10 ** -18)).toEqual('0.001 fV');
        expect(formatter.formatValue(10 ** -15)).toEqual('1 fV');
        expect(formatter.formatValue(10 ** -12)).toEqual('1 pV');
        expect(formatter.formatValue(10 ** -9)).toEqual('1 nV');
        expect(formatter.formatValue(10 ** -6)).toEqual('1 μV');
        expect(formatter.formatValue(10 ** -3)).toEqual('1 mV');
        expect(formatter.formatValue(10 ** -2)).toEqual('1 cV');
        expect(formatter.formatValue(10 ** -1)).toEqual('1 dV');
        expect(formatter.formatValue(1)).toEqual('1 伏特');
        expect(formatter.formatValue(2)).toEqual('2 伏特');
        expect(formatter.formatValue(10 ** 3)).toEqual('1 kV');
        expect(formatter.formatValue(10 ** 6)).toEqual('1 MV');
        expect(formatter.formatValue(10 ** 9)).toEqual('1 GV');
        expect(formatter.formatValue(10 ** 12)).toEqual('1 TV');
        expect(formatter.formatValue(10 ** 15)).toEqual('1 PV');
        expect(formatter.formatValue(10 ** 18)).toEqual('1 EV');
        expect(formatter.formatValue(10 ** 21)).toEqual('1,000 EV');
    });
});
